import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Bath,
  BedDouble,
  Building2,
  ChevronLeft,
  ChevronRight,
  Heart,
  LogOut,
  MapPin,
  Maximize,
  Menu,
  Phone,
  Plus,
  Search,
  User,
  X,
} from "lucide-react";
import "./styles.css";

const API = "http://127.0.0.1:8000/api";
const money = (n) =>
  new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(n);
const token = () => localStorage.getItem("token");
async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (token()) headers.Authorization = `Token ${token()}`;
  const r = await fetch(API + path, { ...options, headers });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw data;
  return data;
}

function App() {
  const [user, setUser] = useState(localStorage.getItem("username"));
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };
  return (
    <>
      <Header user={user} logout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/oglas/:id" element={<Detail />} />
        <Route path="/najava" element={<Auth onAuth={setUser} />} />
        <Route path="/nov-oglas" element={<Create />} />
      </Routes>
      <Footer />
    </>
  );
}

function Header({ user, logout }) {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <Link className="brand" to="/">
        <span>DOM</span>
        <b>.mk</b>
      </Link>
      <nav className={open ? "open" : ""}>
        <Link to="/">Огласи</Link>
        <a href="/#categories">Категории</a>
        <a href="/#about">За нас</a>
        {user ? (
          <button className="nav-user">
            <User size={18} />
            {user}
          </button>
        ) : (
          <Link to="/najava">Најави се</Link>
        )}{" "}
        {user ? (
          <button className="icon-btn" onClick={logout} title="Одјави се">
            <LogOut size={18} />
          </button>
        ) : null}
        <Link className="primary small" to={user ? "/nov-oglas" : "/najava"}>
          <Plus size={18} /> Објави оглас
        </Link>
      </nav>
      <button className="menu" onClick={() => setOpen(!open)}>
        <Menu />
      </button>
    </header>
  );
}

function Home() {
  const [listings, setListings] = useState([]),
    [cats, setCats] = useState([]),
    [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    transaction: "",
  });
  const load = async (e) => {
    e?.preventDefault();
    setLoading(true);
    const q = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    try {
      setListings(await api("/listings/?" + q));
      setCats(await api("/categories/"));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <main>
      <section className="hero">
        <div className="eyebrow">ТВОЈОТ НОВ ДОМ Е ПОБЛИСКУ ОД ШТО МИСЛИШ</div>
        <h1>
          Најди простор
          <br />
          за твојата <i>приказна.</i>
        </h1>
        <p>
          Проверени огласи за станови, куќи, вили и соби низ цела Македонија.
        </p>
        <form className="searchbox" onSubmit={load}>
          <label>
            <Search />
            <input
              placeholder="Град, населба или адреса"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </label>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">Сите типови</option>
            {cats.map((c) => (
              <option value={c.slug} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={filters.transaction}
            onChange={(e) =>
              setFilters({ ...filters, transaction: e.target.value })
            }
          >
            <option value="">Продажба и наем</option>
            <option value="sale">Продажба</option>
            <option value="rent">Изнајмување</option>
          </select>
          <button className="primary">Пребарај</button>
        </form>
        <div className="hero-stats">
          <span>
            <b>1,200+</b> активни огласи
          </span>
          <span>
            <b>24</b> градови
          </span>
          <span>
            <b>100%</b> директен контакт
          </span>
        </div>
      </section>
      <section className="section" id="categories">
        <div className="section-head">
          <div>
            <span className="eyebrow dark">ИСТРАЖИ ПО ТИП</span>
            <h2>Што бараш денес?</h2>
          </div>
        </div>
        <div className="categories">
          {cats.map((c) => (
            <button
              key={c.id}
              onClick={async () => {
                const next = { ...filters, category: c.slug };
                setFilters(next);
                setLoading(true);
                const q = new URLSearchParams(
                  Object.entries(next).filter(([, v]) => v),
                );
                setListings(await api("/listings/?" + q));
                setLoading(false);
                document.querySelector(".grey").scrollIntoView();
              }}
            >
              <span>{c.icon}</span>
              <div>
                <b>{c.name}</b>
                <small>{c.count} огласи</small>
              </div>
              <ChevronRight />
            </button>
          ))}
        </div>
      </section>
      <section className="section grey">
        <div className="section-head">
          <div>
            <span className="eyebrow dark">ИЗБРАНИ НЕДВИЖНОСТИ</span>
            <h2>Најнови огласи</h2>
          </div>
          <span>{listings.length} резултати</span>
        </div>
        {loading ? (
          <div className="loader">Ги вчитуваме огласите…</div>
        ) : (
          <div className="grid">
            {listings.map((x) => (
              <Card key={x.id} x={x} />
            ))}
          </div>
        )}
      </section>
      <section className="about" id="about">
  <div className="about-grid">
    <div>
      <span className="eyebrow dark">ЗА НАС</span>

      <h2>Полесен начин да го пронајдеш својот нов дом.</h2>
    </div>

    <div className="about-text">
      <p>
        DOM.mk е современа македонска платформа специјализирана за
        огласување недвижности. Нашата цел е на едно место да ги поврземе
        сопствениците, купувачите и лицата што бараат дом за изнајмување.
      </p>

      <p>
        За разлика од општите огласници, DOM.mk е фокусиран исклучиво на
        станови, куќи, вили и соби. Корисниците можат лесно да пребаруваат,
        да користат филтри, да разгледуваат повеќе фотографии и директно да
        контактираат со огласувачот.
      </p>
    </div>
  </div>

  <div className="about-values">
    <article>
      <span>01</span>
      <h3>Едноставно пребарување</h3>
      <p>
        Брзо пронаоѓање недвижности според локација, категорија и тип на
        оглас.
      </p>
    </article>

    <article>
      <span>02</span>
      <h3>Детални огласи</h3>
      <p>
        Секој оглас содржи фотографии, цена, квадратура, број на соби и
        контакт.
      </p>
    </article>

    <article>
      <span>03</span>
      <h3>Директен контакт</h3>
      <p>
        Заинтересираните корисници можат директно да контактираат со
        сопственикот.
      </p>
    </article>
  </div>
</section>

<section className="cta">
  <div>
    <span className="eyebrow">ИМАШ НЕДВИЖНОСТ?</span>

    <h2>
      Објави го твојот оглас
      <br />
      за помалку од 2 минути.
    </h2>
  </div>

  <Link
    className="light-btn"
    to={token() ? "/nov-oglas" : "/najava"}
  >
    Започни бесплатно <ChevronRight />
  </Link>
</section>
    </main>
  );
}

function Card({ x }) {
  const img = x.images[0]?.image;
  return (
    <Link to={`/oglas/${x.id}`} className="card">
      <div
        className="card-img"
        style={{ backgroundImage: `url(${img || "/placeholder.svg"})` }}
      >
        <span className="pill">
          {x.transaction === "sale" ? "ПРОДАЖБА" : "ИЗНАЈМУВАЊЕ"}
        </span>
        {x.featured && <span className="featured">ИЗДВОЕНО</span>}
        <button className="heart">
          <Heart />
        </button>
      </div>
      <div className="card-body">
        <small>{x.category_name}</small>
        <h3>{x.title}</h3>
        <p>
          <MapPin /> {x.city}, {x.address}
        </p>
        <div className="features">
          <span>
            <Maximize /> {x.area} m²
          </span>
          <span>
            <BedDouble /> {x.rooms}
          </span>
          <span>
            <Bath /> {x.bathrooms}
          </span>
        </div>
        <div className="price">
          € {money(x.price)}{" "}
          {x.transaction === "rent" && <small>/ месечно</small>}
        </div>
      </div>
    </Link>
  );
}

function Detail() {
  const { id } = useParams(),
    nav = useNavigate();
  const [x, setX] = useState(null),
    [index, setIndex] = useState(0);
  useEffect(() => {
    api(`/listings/${id}/`).then(setX);
  }, [id]);
  if (!x) return <div className="loader page">Се вчитува…</div>;
  const imgs = x.images.length ? x.images : [{ image: "/placeholder.svg" }];
  const remove = async () => {
    if (confirm("Дали сигурно сакате да го избришете огласот?")) {
      await api(`/listings/${id}/`, { method: "DELETE" });
      nav("/");
    }
  };
  return (
    <main className="detail-page">
      <Link to="/" className="back">
        <ChevronLeft /> Назад кон огласи
      </Link>
      <div className="gallery">
        <img src={imgs[index].image} />
        {imgs.length > 1 && (
          <>
            <button
              className="gallery-left"
              onClick={() => setIndex((index - 1 + imgs.length) % imgs.length)}
            >
              <ChevronLeft />
            </button>
            <button
              className="gallery-right"
              onClick={() => setIndex((index + 1) % imgs.length)}
            >
              <ChevronRight />
            </button>
            <span>
              {index + 1} / {imgs.length}
            </span>
          </>
        )}
      </div>
      <div className="detail-grid">
        <article>
          <div className="tags">
            <span>{x.category_name}</span>
            <span>{x.transaction === "sale" ? "Продажба" : "Изнајмување"}</span>
          </div>
          <h1>{x.title}</h1>
          <p className="location">
            <MapPin /> {x.city}, {x.address}
          </p>
          <div className="big-features">
            <span>
              <Maximize />
              <b>{x.area} m²</b>
              <small>Површина</small>
            </span>
            <span>
              <BedDouble />
              <b>{x.rooms}</b>
              <small>Соби</small>
            </span>
            <span>
              <Bath />
              <b>{x.bathrooms}</b>
              <small>Бањи</small>
            </span>
            <span>
              <Building2 />
              <b>{x.floor ?? "—"}</b>
              <small>Кат</small>
            </span>
          </div>
          <h2>Опис на недвижноста</h2>
          <p className="description">{x.description}</p>
        </article>
        <aside>
          <small>Цена</small>
          <div className="aside-price">€ {money(x.price)}</div>
          {x.transaction === "rent" && <p>месечно</p>}
          <hr />
          <small>Огласувач</small>
          <h3>
            <User /> {x.owner_name}
          </h3>
          <a className="primary contact" href={`tel:${x.phone}`}>
            <Phone /> {x.phone}
          </a>
          {x.is_owner && (
            <button className="danger" onClick={remove}>
              Избриши го огласот
            </button>
          )}
        </aside>
      </div>
    </main>
  );
}

function Auth({ onAuth }) {
  const [register, setRegister] = useState(false),
    [form, setForm] = useState({ username: "", email: "", password: "" }),
    [error, setError] = useState("");
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const d = await api(`/auth/${register ? "register" : "login"}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      localStorage.setItem("token", d.token);
      localStorage.setItem("username", d.username);
      onAuth(d.username);
      nav("/");
    } catch (e) {
      setError(e.detail || Object.values(e)[0] || "Проверете ги податоците.");
    }
  };
  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="brand">
          <span>DOM</span>
          <b>.mk</b>
        </div>
        <h1>{register ? "Креирај профил" : "Добредојде назад"}</h1>
        <p>
          {register
            ? "Објавувај и управувај со твоите огласи."
            : "Најави се за да објавиш недвижност."}
        </p>
        {error && <div className="error">{String(error)}</div>}
        <label>
          Корисничко име
          <input
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </label>
        {register && (
          <label>
            Е-пошта
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
        )}
        <label>
          Лозинка
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <button className="primary">
          {register ? "Регистрирај се" : "Најави се"}
        </button>
        <button
          type="button"
          className="text-btn"
          onClick={() => setRegister(!register)}
        >
          {register
            ? "Веќе имаш профил? Најави се"
            : "Немаш профил? Регистрирај се"}
        </button>

      </form>
    </main>
  );
}

function Create() {
  const [cats, setCats] = useState([]),
    [error, setError] = useState("");
  const nav = useNavigate();
  useEffect(() => {
    api("/categories/").then(setCats);
  }, []);
  if (!token()) return <Auth onAuth={() => location.reload()} />;
  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const files = fd.getAll("uploaded_images");
    if (!files[0]?.size) fd.delete("uploaded_images");
    try {
      const d = await api("/listings/", { method: "POST", body: fd });
      nav(`/oglas/${d.id}`);
    } catch (e) {
      setError("Проверете дали сите полиња се правилно пополнети.");
    }
  };
  return (
    <main className="form-page">
      <div className="form-intro">
        <span className="eyebrow dark">НОВ ОГЛАС</span>
        <h1>
          Претстави ја недвижноста
          <br />
          во најдобро светло.
        </h1>
        <p>Пополнете ги деталите и додадете повеќе фотографии.</p>
      </div>
      <form className="listing-form" onSubmit={submit}>
        {error && <div className="error full">{error}</div>}
        <label className="full">
          Наслов
          <input
            name="title"
            required
            placeholder="пр. Модерен стан во Центар"
          />
        </label>
        <label>
          Категорија
          <select name="category" required>
            <option value="">Избери</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Тип на оглас
          <select name="transaction">
            <option value="sale">Продажба</option>
            <option value="rent">Изнајмување</option>
          </select>
        </label>
        <label>
          Град
          <input name="city" required />
        </label>
        <label>
          Населба / адреса
          <input name="address" required />
        </label>
        <label>
          Цена во €<input name="price" type="number" required min="1" />
        </label>
        <label>
          Квадратура m²
          <input name="area" type="number" required min="1" />
        </label>
        <label>
          Број на соби
          <input name="rooms" type="number" required min="1" />
        </label>
        <label>
          Бањи
          <input name="bathrooms" type="number" defaultValue="1" min="1" />
        </label>
        <label>
          Кат
          <input name="floor" type="number" />
        </label>
        <label>
          Телефон
          <input name="phone" required placeholder="070 123 456" />
        </label>
        <label className="check">
          <input name="furnished" type="checkbox" value="true" /> Наместено
        </label>
        <label className="full">
          Опис
          <textarea name="description" required rows="6" />
        </label>
        <label className="full upload">
          Фотографии
          <input name="uploaded_images" type="file" accept="image/*" multiple />
          <span>Избери повеќе фотографии одеднаш</span>
        </label>
        <button className="primary full">Објави го огласот</button>
      </form>
    </main>
  );
}

function Footer() {
  return (
    <footer>
      <div className="brand">
        <span>DOM</span>
        <b>.mk</b>
      </div>
      <p>Твојот простор. Твојата приказна.</p>
      <small>© 2026 DOM.mk</small>
    </footer>
  );
}
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
