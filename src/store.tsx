import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ACCOUNTS, productBySlug, seedOrders, seedProjects, type DemoAccount } from "./catalog";
import { priceFor, PROMO_CODE, quote } from "./pricing";
import type { CartLine, Ledger, Order, Project, ShipTo, Tier, User } from "./types";

const KEY = "larken.ledger.v1";

const EMPTY: Ledger = {
  cart: [],
  user: null,
  orders: [],
  projects: [],
  promo: null,
  recent: [],
};

function load(): Ledger {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Ledger>;
    if (!parsed || !Array.isArray(parsed.cart)) return EMPTY;
    return {
      cart: parsed.cart ?? [],
      user: parsed.user ?? null,
      orders: parsed.orders ?? [],
      projects: parsed.projects ?? [],
      promo: parsed.promo ?? null,
      recent: parsed.recent ?? [],
    };
  } catch {
    return EMPTY;
  }
}

function toUser(account: DemoAccount): User {
  return {
    email: account.email,
    company: account.company,
    contact: account.contact,
    short: account.short,
    tier: account.tier,
    terms: account.terms,
    costCenters: account.costCenters,
  };
}

export interface CheckoutDraft {
  email: string;
  company: string;
  contact: string;
  po: string;
  costCenter: string;
  projectName: string;
  needBy: string;
  whiteGlove: boolean;
  ship: ShipTo;
}

interface StoreValue {
  cart: CartLine[];
  user: User | null;
  orders: Order[];
  projects: Project[];
  promo: string | null;
  recent: string[];
  tier: Tier;
  notice: string | null;
  count: number;
  dismissNotice: () => void;
  addToCart: (slug: string, finishId: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeLine: (id: string) => void;
  clearCart: () => void;
  applyPromo: (code: string) => string | null;
  clearPromo: () => void;
  signIn: (email: string, password: string) => string | null;
  openTrade: (input: { company: string; contact: string; email: string }) => void;
  signOut: () => void;
  placeOrder: (draft: CheckoutDraft) => Order;
  remember: (slug: string) => void;
  createProject: (name: string, site: string, notes: string) => string | null;
  addToProject: (projectId: string, slug: string, finishId: string, qty: number) => void;
  setProjectQty: (projectId: string, slug: string, finishId: string, qty: number) => void;
  removeProject: (projectId: string) => void;
  projectToCart: (projectId: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ledger, setLedger] = useState<Ledger>(() => load());
  const [notice, setNotice] = useState<string | null>(null);
  const ledgerRef = useRef(ledger);
  ledgerRef.current = ledger;

  const commit = useCallback((recipe: (prev: Ledger) => Ledger) => {
    const next = recipe(ledgerRef.current);
    ledgerRef.current = next;
    setLedger(next);
    return next;
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ledger));
  }, [ledger]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const tier: Tier = ledger.user?.tier ?? "guest";

  const addToCart = useCallback((slug: string, finishId: string, qty = 1) => {
    const product = productBySlug(slug);
    if (!product) return;
    const id = `${slug}::${finishId}`;
    commit((prev) => {
      const existing = prev.cart.find((line) => line.id === id);
      const cart = existing
        ? prev.cart.map((line) => (line.id === id ? { ...line, qty: line.qty + qty } : line))
        : [...prev.cart, { id, slug, finishId, qty }];
      return { ...prev, cart };
    });
    setNotice(`${product.name} added to the order`);
  }, [commit]);

  const setQty = useCallback((id: string, qty: number) => {
    commit((prev) => ({
      ...prev,
      cart: qty <= 0 ? prev.cart.filter((line) => line.id !== id) : prev.cart.map((line) => (line.id === id ? { ...line, qty } : line)),
    }));
  }, [commit]);

  const removeLine = useCallback((id: string) => {
    commit((prev) => ({ ...prev, cart: prev.cart.filter((line) => line.id !== id) }));
  }, [commit]);

  const clearCart = useCallback(() => {
    commit((prev) => ({ ...prev, cart: [], promo: null }));
  }, [commit]);

  const applyPromo = useCallback((code: string) => {
    if (code.trim().toUpperCase() !== PROMO_CODE) return "That code is not on this schedule.";
    commit((prev) => ({ ...prev, promo: PROMO_CODE }));
    return null;
  }, [commit]);

  const clearPromo = useCallback(() => {
    commit((prev) => ({ ...prev, promo: null }));
  }, [commit]);

  const adopt = useCallback((user: User, account?: DemoAccount) => {
    commit((prev) => {
      const orders = account
        ? [
            ...seedOrders(account).filter((order) => !prev.orders.some((existing) => existing.id === order.id)),
            ...prev.orders,
          ]
        : prev.orders;
      const projects = account
        ? [
            ...seedProjects(account).filter((project) => !prev.projects.some((existing) => existing.id === project.id)),
            ...prev.projects,
          ]
        : prev.projects;
      return { ...prev, user, orders, projects };
    });
  }, [commit]);

  const signIn = useCallback(
    (email: string, password: string) => {
      const account = ACCOUNTS.find(
        (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
      );
      if (!account) return "Those credentials are not on the demo desk.";
      adopt(toUser(account), account);
      setNotice(`Signed in to ${account.company}`);
      return null;
    },
    [adopt],
  );

  const openTrade = useCallback(
    (input: { company: string; contact: string; email: string }) => {
      const user: User = {
        email: input.email.trim(),
        company: input.company.trim(),
        contact: input.contact.trim(),
        short: input.company.trim().split(" ")[0] || "Trade",
        tier: "trade",
        terms: "Net 30",
        costCenters: [],
      };
      adopt(user);
      setNotice(`Trade schedule open for ${user.company}`);
    },
    [adopt],
  );

  const signOut = useCallback(() => {
    commit((prev) => ({ ...prev, user: null }));
    setNotice("Signed out. The order is still on list pricing.");
  }, [commit]);

  const placeOrder = useCallback(
    (draft: CheckoutDraft) => {
      let created: Order | null = null;
      commit((prev) => {
        const activeTier = prev.user?.tier ?? "guest";
        const priced = prev.cart.flatMap((line) => {
          const product = productBySlug(line.slug);
          if (!product) return [];
          const finish = product.finishes.find((item) => item.id === line.finishId) ?? product.finishes[0];
          return [
            {
              slug: product.slug,
              name: product.name,
              sku: product.sku,
              finish: finish.name,
              qty: line.qty,
              unit: priceFor(product, activeTier),
              list: product.price,
            },
          ];
        });
        const totals = quote(
          priced.map((line) => ({ unit: line.unit, qty: line.qty, list: line.list })),
          prev.promo,
          draft.whiteGlove,
        );
        const sequence = 10430 + prev.orders.length;
        created = {
          id: `LK-${sequence}`,
          placedAt: new Date().toISOString(),
          email: draft.email,
          company: draft.company,
          contact: draft.contact,
          tier: activeTier,
          terms: prev.user?.terms ?? "Due at order",
          po: draft.po,
          costCenter: draft.costCenter,
          projectName: draft.projectName,
          needBy: draft.needBy,
          whiteGlove: draft.whiteGlove,
          ship: draft.ship,
          lines: priced.map((line) => ({
            slug: line.slug,
            name: line.name,
            sku: line.sku,
            finish: line.finish,
            qty: line.qty,
            unit: line.unit,
          })),
          listValue: totals.listValue,
          merchandise: totals.merchandise,
          discount: totals.discount,
          freight: totals.freight,
          tax: totals.tax,
          total: totals.total,
          status: "Confirmed",
        };
        return { ...prev, orders: [created, ...prev.orders], cart: [], promo: null };
      });
      if (!created) throw new Error("Order was not written.");
      return created;
    },
    [commit],
  );

  const remember = useCallback((slug: string) => {
    commit((prev) => {
      const recent = [slug, ...prev.recent.filter((item) => item !== slug)].slice(0, 4);
      if (recent.join() === prev.recent.join()) return prev;
      return { ...prev, recent };
    });
  }, [commit]);

  const createProject = useCallback((name: string, site: string, notes: string) => {
    let id: string | null = null;
    commit((prev) => {
      if (!prev.user) return prev;
      id = `PR-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const project: Project = {
        id,
        owner: prev.user.email,
        name: name.trim(),
        site: site.trim(),
        notes: notes.trim(),
        lines: [],
      };
      return { ...prev, projects: [project, ...prev.projects] };
    });
    return id;
  }, [commit]);

  const addToProject = useCallback((projectId: string, slug: string, finishId: string, qty: number) => {
    const product = productBySlug(slug);
    commit((prev) => ({
      ...prev,
      projects: prev.projects.map((project) => {
        if (project.id !== projectId) return project;
        const existing = project.lines.find((line) => line.slug === slug && line.finishId === finishId);
        const lines = existing
          ? project.lines.map((line) =>
              line.slug === slug && line.finishId === finishId ? { ...line, qty: line.qty + qty } : line,
            )
          : [...project.lines, { slug, finishId, qty }];
        return { ...project, lines };
      }),
    }));
    if (product) setNotice(`${product.name} parked on the project`);
  }, [commit]);

  const setProjectQty = useCallback((projectId: string, slug: string, finishId: string, qty: number) => {
    commit((prev) => ({
      ...prev,
      projects: prev.projects.map((project) => {
        if (project.id !== projectId) return project;
        const lines =
          qty <= 0
            ? project.lines.filter((line) => !(line.slug === slug && line.finishId === finishId))
            : project.lines.map((line) =>
                line.slug === slug && line.finishId === finishId ? { ...line, qty } : line,
              );
        return { ...project, lines };
      }),
    }));
  }, [commit]);

  const removeProject = useCallback((projectId: string) => {
    commit((prev) => ({ ...prev, projects: prev.projects.filter((project) => project.id !== projectId) }));
  }, [commit]);

  const projectToCart = useCallback((projectId: string) => {
    commit((prev) => {
      const project = prev.projects.find((item) => item.id === projectId);
      if (!project) return prev;
      let cart = [...prev.cart];
      for (const line of project.lines) {
        const id = `${line.slug}::${line.finishId}`;
        const existing = cart.find((item) => item.id === id);
        cart = existing
          ? cart.map((item) => (item.id === id ? { ...item, qty: item.qty + line.qty } : item))
          : [...cart, { id, slug: line.slug, finishId: line.finishId, qty: line.qty }];
      }
      return { ...prev, cart };
    });
    setNotice("Project moved onto the order");
  }, [commit]);

  const count = ledger.cart.reduce((sum, line) => sum + line.qty, 0);

  const value = useMemo<StoreValue>(
    () => ({
      cart: ledger.cart,
      user: ledger.user,
      orders: ledger.orders,
      projects: ledger.projects,
      promo: ledger.promo,
      recent: ledger.recent,
      tier,
      notice,
      count,
      dismissNotice: () => setNotice(null),
      addToCart,
      setQty,
      removeLine,
      clearCart,
      applyPromo,
      clearPromo,
      signIn,
      openTrade,
      signOut,
      placeOrder,
      remember,
      createProject,
      addToProject,
      setProjectQty,
      removeProject,
      projectToCart,
    }),
    [
      ledger,
      tier,
      notice,
      count,
      addToCart,
      setQty,
      removeLine,
      clearCart,
      applyPromo,
      clearPromo,
      signIn,
      openTrade,
      signOut,
      placeOrder,
      remember,
      createProject,
      addToProject,
      setProjectQty,
      removeProject,
      projectToCart,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("Store missing");
  return store;
}
