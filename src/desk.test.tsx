import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import readme from "../README.md?raw";
import { App } from "./App";
import { describeCart } from "./cartview";
import { ACCOUNTS, PRODUCTS, productBySku } from "./catalog";
import { checkoutErrors, type CheckoutFields } from "./checkoutRules";
import { PIECES } from "./pieces";
import { Checkout } from "./pages/Checkout";
import { QuickOrder } from "./pages/QuickOrder";
import { priceFor, PROMO_CODE, quote } from "./pricing";
import { parseQuickOrder } from "./quickorder";
import { StoreProvider, useStore, type CheckoutDraft } from "./store";

const CARD = "4242424242424242";

const ship: CheckoutDraft = {
  email: "buyer@example.com",
  company: "Example Floor",
  contact: "Ada Buyer",
  po: "",
  costCenter: "",
  projectName: "Library",
  needBy: "2026-11-01",
  whiteGlove: false,
  ship: {
    site: "Example Floor",
    line1: "1 Market Street",
    line2: "",
    city: "Grand Rapids",
    region: "MI",
    postal: "49503",
  },
};

function validCard(po = ""): CheckoutFields {
  return {
    email: "buyer@example.com",
    company: "Example Floor",
    contact: "Ada Buyer",
    po,
    line1: "1 Market Street",
    city: "Grand Rapids",
    region: "MI",
    postal: "49503",
    cardName: "Ada Buyer",
    card: CARD,
    exp: "12/28",
    cvc: "123",
  };
}

function desk() {
  return renderHook(() => useStore(), {
    wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>,
  });
}

beforeEach(() => {
  localStorage.clear();
  cleanup();
});

describe("catalog and schedule", () => {
  it("gives every SKU a price schedule, finishes, and a drawing", () => {
    expect(PRODUCTS.length).toBeGreaterThan(1);
    const categories = new Set(PRODUCTS.map((product) => product.category));
    expect(categories.size).toBeGreaterThan(1);
    for (const product of PRODUCTS) {
      expect(product.price).toBeGreaterThan(0);
      expect(product.tradePrice).toBeGreaterThan(0);
      expect(product.contractPrice).toBeGreaterThan(0);
      expect(product.finishes.length).toBeGreaterThan(0);
      expect(PIECES[product.slug]?.length).toBeGreaterThan(0);
      expect(priceFor(product, "guest")).toBe(product.price);
      expect(priceFor(product, "trade")).toBe(product.tradePrice);
      expect(priceFor(product, "enterprise")).toBe(product.contractPrice);
    }
  });

  it("matches the sample desks and LARKEN10 printed in the readme", () => {
    for (const account of ACCOUNTS) {
      expect(readme).toContain(account.email);
      expect(readme).toContain(account.password);
    }
    expect(readme).toContain(PROMO_CODE);
    expect(ACCOUNTS.find((account) => account.email === "studio@fieldwork.design")?.password).toBe("trade");
    expect(ACCOUNTS.find((account) => account.email === "procurement@northline.com")?.password).toBe("enterprise");
    console.log("Demo passwords and LARKEN10 match the desk printed in the project readme.");
  });

  it("prices tiers, promo, freight, tax, and total from the shipped quote", () => {
    const keel = PRODUCTS.find((product) => product.sku === "KL-TSK-01");
    expect(keel).toBeTruthy();
    for (const tier of ["guest", "trade", "enterprise"] as const) {
      const view = describeCart(
        [{ id: `${keel!.slug}::charcoal`, slug: keel!.slug, finishId: "charcoal", qty: 2 }],
        tier,
        null,
        false,
      );
      const expected = quote([{ unit: priceFor(keel!, tier), qty: 2, list: keel!.price }], null, false);
      expect(view.lines[0].unit).toBe(priceFor(keel!, tier));
      expect(view.merchandise).toBe(expected.merchandise);
      expect(view.freight).toBe(expected.freight);
      expect(view.tax).toBe(expected.tax);
      expect(view.total).toBe(expected.total);
    }

    const open = quote([{ unit: 800, qty: 1, list: 800 }], null, false);
    const coded = quote([{ unit: 800, qty: 1, list: 800 }], PROMO_CODE, false);
    const rejected = quote([{ unit: 800, qty: 1, list: 800 }], "NOPE", false);
    expect(coded.merchandise).toBe(open.merchandise);
    expect(coded.discount).toBe(80);
    expect(coded.freight).toBe(open.freight);
    expect(rejected.discount).toBe(0);
    expect(rejected.total).toBe(open.total);

    expect(quote([{ unit: 2499, qty: 1, list: 2499 }], null, false).freight).toBe(145);
    expect(quote([{ unit: 2500, qty: 1, list: 2500 }], null, false).freight).toBe(0);
    expect(quote([{ unit: 2500, qty: 1, list: 2500 }], null, true).freight).toBe(280);
    expect(quote([{ unit: 1000, qty: 1, list: 1000 }], null, true).freight).toBe(425);

    const dropped = quote([{ unit: 2600, qty: 1, list: 2600 }], PROMO_CODE, false);
    expect(dropped.net).toBe(2340);
    expect(dropped.freight).toBe(145);

    const taxed = quote([{ unit: 1000, qty: 1, list: 1000 }], null, false);
    expect(Math.abs(taxed.tax - taxed.net * 0.0725)).toBeLessThanOrEqual(0.005);
    expect(taxed.total).toBeCloseTo(taxed.net + taxed.freight + taxed.tax, 2);
  });
});

describe("store actions", () => {
  it("merges the same finish, signs in to the sample schedules, and copies a project onto the cart", () => {
    const { result } = desk();
    act(() => {
      result.current.addToCart("hale-lounge", "oatmeal", 1);
      result.current.addToCart("hale-lounge", "oatmeal", 2);
    });
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].qty).toBe(3);
    act(() => result.current.addToCart("hale-lounge", "ink", 1));
    expect(result.current.cart).toHaveLength(2);

    expect(result.current.signIn("studio@fieldwork.design", "nope")).toMatch(/not on the demo desk/i);
    expect(result.current.signIn("studio@fieldwork.design", "trade")).toBeNull();
    expect(result.current.tier).toBe("trade");
    expect(result.current.user?.terms).toBe("Net 30");

    const projectId = result.current.createProject("Harbor", "90 Union", "rail");
    expect(projectId).toBeTruthy();
    act(() => {
      result.current.addToProject(projectId!, "mare-stool", "oak", 4);
      result.current.addToCart("mare-stool", "oak", 1);
      result.current.projectToCart(projectId!);
    });
    const stool = result.current.cart.find((line) => line.slug === "mare-stool" && line.finishId === "oak");
    expect(stool?.qty).toBe(5);
  });

  it("rejects a bad code, places a quoted order, and stores no card fields", () => {
    const { result } = desk();
    act(() => result.current.addToCart("cinder-vessel", "ash", 2));
    expect(result.current.applyPromo("NOPE")).toMatch(/not on this schedule/i);
    expect(result.current.promo).toBeNull();
    expect(result.current.applyPromo("larken10")).toBeNull();
    expect(result.current.promo).toBe(PROMO_CODE);

    const expected = describeCart(result.current.cart, result.current.tier, result.current.promo, false);
    let orderId = "";
    act(() => {
      const order = result.current.placeOrder(ship);
      orderId = order.id;
      expect(order.status).toBe("Confirmed");
      expect(order.lines[0].unit).toBe(expected.lines[0].unit);
      expect(order.merchandise).toBe(expected.merchandise);
      expect(order.discount).toBe(expected.discount);
      expect(order.freight).toBe(expected.freight);
      expect(order.tax).toBe(expected.tax);
      expect(order.total).toBe(expected.total);
      expect(JSON.stringify(order)).not.toContain(CARD);
      expect(order).not.toHaveProperty("card");
      expect(order).not.toHaveProperty("cvc");
      expect(order).not.toHaveProperty("exp");
    });
    expect(result.current.cart).toEqual([]);
    expect(result.current.promo).toBeNull();
    expect(result.current.orders[0].id).toBe(orderId);
    expect(localStorage.getItem("larken.ledger.v1")).not.toContain(CARD);
  });

  it("signs the contract desk in at net 45", () => {
    const { result } = desk();
    expect(result.current.signIn("procurement@northline.com", "enterprise")).toBeNull();
    expect(result.current.tier).toBe("enterprise");
    expect(result.current.user?.terms).toBe("Net 45");
  });
});

describe("quick order and checkout", () => {
  it("parses a known SKU onto the cart and skips an unknown one", () => {
    const parsed = parseQuickOrder("HL-LNG-01, 2\nNO-SUCH 9");
    expect(parsed[0]).toMatchObject({ sku: "HL-LNG-01", qty: 2, known: true });
    expect(parsed[1].known).toBe(false);
    const product = productBySku(parsed[0].sku);
    expect(product?.name).toBe("Hale Lounge");

    let api: ReturnType<typeof useStore> | null = null;
    function Shell() {
      api = useStore();
      return <QuickOrder />;
    }
    render(
      <MemoryRouter>
        <StoreProvider>
          <Shell />
        </StoreProvider>
      </MemoryRouter>,
    );
    act(() => api!.addToCart(product!.slug, product!.finishes[0].id, 1));
    fireEvent.change(screen.getByLabelText("SKUs"), { target: { value: "HL-LNG-01 2\nNO-SUCH 9" } });
    fireEvent.click(screen.getByRole("button", { name: "Read the list" }));
    fireEvent.click(screen.getByRole("button", { name: "Add the known SKUs" }));
    const hale = api!.cart.filter((line) => line.slug === "hale-lounge");
    expect(hale).toHaveLength(1);
    expect(hale[0].qty).toBe(3);
    expect(hale[0].finishId).toBe(product!.finishes[0].id);
    expect(api!.cart.some((line) => line.slug === "NO-SUCH")).toBe(false);
  });

  it("refuses an enterprise order without a purchase order, then records the quote", () => {
    expect(checkoutErrors(validCard(""), "enterprise").po).toMatch(/purchase order/i);
    expect(checkoutErrors(validCard(""), "guest").po).toBeUndefined();
    expect(checkoutErrors(validCard("PO-1"), "enterprise")).toEqual({});

    let api: ReturnType<typeof useStore> | null = null;
    function Gate() {
      const store = useStore();
      const storeRef = useRef(store);
      storeRef.current = store;
      const [ready, setReady] = useState(false);
      useEffect(() => {
        const current = storeRef.current;
        current.signIn("procurement@northline.com", "enterprise");
        current.addToCart("keel-task", "charcoal", 2);
        current.applyPromo(PROMO_CODE);
        setReady(true);
      }, []);
      api = store;
      if (!ready) return null;
      return <Checkout />;
    }
    render(
      <MemoryRouter initialEntries={["/checkout"]}>
        <StoreProvider>
          <Gate />
        </StoreProvider>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText("Street"), { target: { value: "300 Colorado Street" } });
    fireEvent.change(screen.getByLabelText("City"), { target: { value: "Austin" } });
    fireEvent.change(screen.getByLabelText("State"), { target: { value: "TX" } });
    fireEvent.change(screen.getByLabelText("Postal"), { target: { value: "78701" } });
    fireEvent.change(screen.getByLabelText("Name on card"), { target: { value: "Jordan Hale" } });
    fireEvent.change(screen.getByLabelText("Card number"), { target: { value: CARD } });
    fireEvent.change(screen.getByLabelText("Expiry"), { target: { value: "12/28" } });
    fireEvent.change(screen.getByLabelText("CVC"), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /White-glove/ }));
    fireEvent.click(screen.getByRole("button", { name: "Place order" }));

    expect(screen.getByText(/Contract orders need a purchase order/)).toBeTruthy();
    expect(api!.cart).toHaveLength(1);
    expect(api!.orders.some((order) => order.email === "procurement@northline.com" && order.po === "")).toBe(false);

    const expected = describeCart(api!.cart, api!.tier, api!.promo, true);
    fireEvent.change(screen.getByLabelText("Purchase order"), { target: { value: "PO-900" } });
    fireEvent.click(screen.getByRole("button", { name: "Place order" }));

    const placed = api!.orders.find((order) => order.po === "PO-900");
    expect(placed).toBeTruthy();
    expect(placed!.status).toBe("Confirmed");
    expect(placed!.tier).toBe("enterprise");
    expect(placed!.lines[0].unit).toBe(expected.lines[0].unit);
    expect(placed!.merchandise).toBe(expected.merchandise);
    expect(placed!.discount).toBe(expected.discount);
    expect(placed!.freight).toBe(expected.freight);
    expect(placed!.tax).toBe(expected.tax);
    expect(placed!.total).toBe(expected.total);
    expect(api!.cart).toEqual([]);
    expect(JSON.stringify(placed)).not.toContain(CARD);
    expect(localStorage.getItem("larken.ledger.v1")).not.toContain(CARD);
  });
});

describe("routes", () => {
  const pages: [string, RegExp][] = [
    ["/", /Specify it/],
    ["/catalog", /The catalog/],
    ["/product/hale-lounge", /Hale Lounge/],
    ["/cart", /Nothing on the order/],
    ["/checkout", /Nothing on the order/],
    ["/account", /The desk/],
    ["/trade", /Three schedules/],
    ["/projects", /Park a floor/],
    ["/quick-order", /Paste the SKUs/],
    ["/about", /frame shop/],
    ["/contact", /Write the desk/],
    ["/policies", /Freight, returns, warranty/],
  ];

  it("opens each desk route instead of the missing page", () => {
    for (const [path, heading] of pages) {
      const view = render(
        <MemoryRouter initialEntries={[path]}>
          <StoreProvider>
            <App />
          </StoreProvider>
        </MemoryRouter>,
      );
      expect(screen.getByRole("heading", { level: 1, name: heading })).toBeTruthy();
      expect(screen.queryByRole("heading", { name: /Not on the floor/ })).toBeNull();
      view.unmount();
    }
  });

  it("shows finishes and adds the selected one from the product page", () => {
    let api: ReturnType<typeof useStore> | null = null;
    function Probe({ children }: { children: ReactNode }) {
      api = useStore();
      return children;
    }
    render(
      <MemoryRouter initialEntries={["/product/hale-lounge"]}>
        <StoreProvider>
          <Probe>
            <App />
          </Probe>
        </StoreProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole("radio", { name: "Oatmeal bouclé" })).toBeTruthy();
    expect(screen.getByText(/\$2,480/)).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "Ink leather" }));
    fireEvent.click(screen.getByRole("button", { name: "Add to order" }));
    expect(api!.cart).toEqual([{ id: "hale-lounge::ink", slug: "hale-lounge", finishId: "ink", qty: 1 }]);
  });
});
