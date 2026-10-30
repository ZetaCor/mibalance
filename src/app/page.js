'use client';
import { useEffect, useState } from 'react';

const num = (v) => parseFloat(v) || 0;
const UNIDADES = ['g', 'kg', 'ml', 'l', 'unidad'];

const INSUMOS_FLAN = [
  {
    id: 'i1',
    nombre: 'Leche condensada',
    precio: '',
    envase: '397',
    usada: '397',
    unidad: 'g',
    desperdicio: false,
  },
  {
    id: 'i2',
    nombre: 'Leche evaporada',
    precio: '',
    envase: '354',
    usada: '354',
    unidad: 'ml',
    desperdicio: false,
  },
  {
    id: 'i3',
    nombre: 'Huevos',
    precio: '',
    envase: '30',
    usada: '6',
    unidad: 'unidad',
    desperdicio: false,
  },
  {
    id: 'i4',
    nombre: 'Azúcar (caramelo)',
    precio: '',
    envase: '1000',
    usada: '150',
    unidad: 'g',
    desperdicio: false,
  },
  {
    id: 'i5',
    nombre: 'Esencia de vainilla',
    precio: '',
    envase: '60',
    usada: '5',
    unidad: 'ml',
    desperdicio: false,
  },
];

const field =
  'w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-base text-stone-800 placeholder:text-stone-400 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200';
const card = 'rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm';
const btnSoft =
  'rounded-xl bg-amber-50 px-3.5 py-2 text-sm font-medium text-amber-800 ring-1 ring-amber-200 transition hover:bg-amber-100 active:scale-95';
const btnGhost =
  'rounded-lg px-2 py-1 text-sm text-stone-400 transition hover:bg-red-50 hover:text-red-600';

function Logo({ size = 44 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-label="MiBalance"
    >
      <rect
        width="64"
        height="64"
        rx="16"
        fill="#FFF3DC"
      />
      <ellipse
        cx="32"
        cy="47"
        rx="23"
        ry="5"
        fill="#E9D5B0"
      />
      <path
        d="M16 45 L20 29 Q32 23 44 29 L48 45 Q32 51 16 45 Z"
        fill="#F8CF72"
      />
      <path
        d="M20 29 Q32 21 44 29 Q44 34 40.5 34 Q39.5 40 36.5 34 Q33.5 32 31.5 36 Q29.5 40 27 34 Q22.5 35 20 29 Z"
        fill="#B4601A"
      />
      <path
        d="M24 38 Q25 43 24.5 44"
        stroke="#FFF3DC"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity=".7"
      />
    </svg>
  );
}

function Campo({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-stone-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function Titulo({ n, children, sub }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
          {n}
        </span>
        <h2 className="font-semibold text-stone-800">{children}</h2>
      </div>
      {sub && (
        <p className="mt-1 text-xs leading-relaxed text-stone-500">{sub}</p>
      )}
    </div>
  );
}

export default function Home() {
  const [moneda, setMoneda] = useState('$');
  const [producto, setProducto] = useState('flan');
  const [insumos, setInsumos] = useState(INSUMOS_FLAN);
  const [gastos, setGastos] = useState([]);
  const [rebanadas, setRebanadas] = useState('12');
  const [margen, setMargen] = useState('50');
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      const g = localStorage.getItem('mibalance');
      if (g) {
        const d = JSON.parse(g);
        if (d.moneda) setMoneda(d.moneda);
        if (d.producto) setProducto(d.producto);
        if (d.insumos) setInsumos(d.insumos);
        if (d.gastos) setGastos(d.gastos);
        if (d.rebanadas) setRebanadas(d.rebanadas);
        if (d.margen) setMargen(d.margen);
      }
    } catch {}
    setListo(true);
  }, []);

  useEffect(() => {
    if (!listo) return;
    try {
      localStorage.setItem(
        'mibalance',
        JSON.stringify({
          moneda,
          producto,
          insumos,
          gastos,
          rebanadas,
          margen,
        }),
      );
    } catch {}
  }, [listo, moneda, producto, insumos, gastos, rebanadas, margen]);

  const cambiarProducto = (p) => {
    setProducto(p);
    setInsumos(p === 'flan' ? INSUMOS_FLAN : []);
  };

  const setI = (id, campo, valor) =>
    setInsumos((l) =>
      l.map((x) => (x.id === id ? { ...x, [campo]: valor } : x)),
    );
  const setG = (id, campo, valor) =>
    setGastos((l) =>
      l.map((x) => (x.id === id ? { ...x, [campo]: valor } : x)),
    );

  const agregarInsumo = () =>
    setInsumos((l) => [
      ...l,
      {
        id: 'i' + Date.now(),
        nombre: '',
        precio: '',
        envase: '',
        usada: '',
        unidad: 'g',
        desperdicio: false,
      },
    ]);

  const agregarGasto = (tipo) =>
    setGastos((l) => [
      ...l,
      {
        id: 'g' + Date.now(),
        tipo,
        nombre: {
          luz: 'Luz',
          gas: 'Gas',
          transporte: 'Transporte',
          otro: 'Otro gasto',
        }[tipo],
        monto: '',
        watts: '',
        horas: '',
        tarifa: '',
        bombona: '',
        preparaciones: '',
      },
    ]);

  const costoInsumo = (x) => {
    const precio = num(x.precio);
    const envase = num(x.envase);
    const usada = num(x.usada);
    if (!envase) return 0;
    return x.desperdicio
      ? precio * Math.ceil(usada / envase)
      : (precio * usada) / envase;
  };

  const costoGasto = (g) => {
    if (g.tipo === 'luz')
      return (num(g.watts) / 1000) * num(g.horas) * num(g.tarifa);
    if (g.tipo === 'gas')
      return num(g.preparaciones) ? num(g.bombona) / num(g.preparaciones) : 0;
    return num(g.monto);
  };

  const totalInsumos = insumos.reduce((s, x) => s + costoInsumo(x), 0);
  const totalGastos = gastos.reduce((s, g) => s + costoGasto(g), 0);
  const costoTotal = totalInsumos + totalGastos;
  const nReb = num(rebanadas);
  const precioCompleto = costoTotal * (1 + num(margen) / 100);
  const precioRebanada = nReb ? precioCompleto / nReb : 0;
  const costoRebanada = nReb ? costoTotal / nReb : 0;
  const fmt = (n) => `${moneda} ${n.toFixed(2)}`;

  const numInput = (valor, onChange, extra = {}) => (
    <input
      className={field}
      type="number"
      inputMode="decimal"
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      {...extra}
    />
  );

  return (
    <div className="min-h-screen pb-28">
      <header className="border-b border-stone-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
          <Logo />
          <div>
            <h1 className="text-lg font-bold leading-tight text-stone-800">
              MiBalance
            </h1>
            <p className="text-xs text-stone-500">
              Calcula tus costos y el precio justo de venta
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-4 pt-4">
        {/* 1 Producto */}
        <section className={card}>
          <Titulo n="1">Producto</Titulo>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Campo label="Tipo de producto">
                <select
                  className={field}
                  value={producto}
                  onChange={(e) => cambiarProducto(e.target.value)}
                >
                  <option value="flan">Flan venezolano</option>
                  <option value="otro">Otro producto</option>
                </select>
              </Campo>
            </div>
            <Campo label="Moneda">
              <input
                className={field}
                value={moneda}
                onChange={(e) => setMoneda(e.target.value)}
              />
            </Campo>
          </div>
        </section>

        {/* 2 Insumos */}
        <section className={card}>
          <Titulo
            n="2"
            sub="Pon el precio y la cantidad del envase completo, y cuánto usa tu receta (en la misma unidad). Si el sobrante se pierde, marca la casilla y se cobra el envase completo."
          >
            Insumos
          </Titulo>

          <div className="space-y-3">
            {insumos.map((x) => (
              <div
                key={x.id}
                className="rounded-xl bg-stone-50/70 p-3 ring-1 ring-stone-200/70"
              >
                <Campo label="Insumo">
                  <input
                    className={field}
                    placeholder="Ej. Harina"
                    value={x.nombre}
                    onChange={(e) => setI(x.id, 'nombre', e.target.value)}
                  />
                </Campo>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Campo label="Precio del envase">
                    {numInput(x.precio, (v) => setI(x.id, 'precio', v))}
                  </Campo>
                  <Campo label="Unidad">
                    <select
                      className={field}
                      value={x.unidad}
                      onChange={(e) => setI(x.id, 'unidad', e.target.value)}
                    >
                      {UNIDADES.map((u) => (
                        <option key={u}>{u}</option>
                      ))}
                    </select>
                  </Campo>
                  <Campo label="Cantidad que trae">
                    {numInput(x.envase, (v) => setI(x.id, 'envase', v))}
                  </Campo>
                  <Campo label="Cantidad que usa">
                    {numInput(x.usada, (v) => setI(x.id, 'usada', v))}
                  </Campo>
                </div>
                <label className="mt-3 flex items-center gap-2 text-sm text-stone-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-amber-600"
                    checked={x.desperdicio}
                    onChange={(e) =>
                      setI(x.id, 'desperdicio', e.target.checked)
                    }
                  />
                  El sobrante se pierde
                </label>
                <div className="mt-2 flex items-center justify-between">
                  <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-sm font-semibold text-amber-900">
                    {fmt(costoInsumo(x))}
                  </span>
                  <button
                    className={btnGhost}
                    onClick={() =>
                      setInsumos((l) => l.filter((i) => i.id !== x.id))
                    }
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button
              className={btnSoft}
              onClick={agregarInsumo}
            >
              + Agregar insumo
            </button>
            <p className="text-sm text-stone-500">
              Total: <b className="text-stone-800">{fmt(totalInsumos)}</b>
            </p>
          </div>
        </section>

        {/* 3 Gastos */}
        <section className={card}>
          <Titulo
            n="3"
            sub="Lo que gastas por cada preparación. Agrega solo los que apliquen a ti."
          >
            Gastos fijos
          </Titulo>

          <div className="space-y-3">
            {gastos.map((g) => (
              <div
                key={g.id}
                className="rounded-xl bg-stone-50/70 p-3 ring-1 ring-stone-200/70"
              >
                <Campo label="Nombre">
                  <input
                    className={field}
                    value={g.nombre}
                    onChange={(e) => setG(g.id, 'nombre', e.target.value)}
                  />
                </Campo>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {g.tipo === 'luz' && (
                    <>
                      <Campo label="Potencia (watts)">
                        {numInput(g.watts, (v) => setG(g.id, 'watts', v))}
                      </Campo>
                      <Campo label="Horas de uso">
                        {numInput(g.horas, (v) => setG(g.id, 'horas', v))}
                      </Campo>
                      <Campo label="Tarifa por kWh">
                        {numInput(g.tarifa, (v) => setG(g.id, 'tarifa', v))}
                      </Campo>
                    </>
                  )}
                  {g.tipo === 'gas' && (
                    <>
                      <Campo label="Precio de la bombona">
                        {numInput(g.bombona, (v) => setG(g.id, 'bombona', v))}
                      </Campo>
                      <Campo label="Preparaciones que rinde">
                        {numInput(g.preparaciones, (v) =>
                          setG(g.id, 'preparaciones', v),
                        )}
                      </Campo>
                    </>
                  )}
                  {(g.tipo === 'transporte' || g.tipo === 'otro') && (
                    <Campo label="Monto por preparación">
                      {numInput(g.monto, (v) => setG(g.id, 'monto', v))}
                    </Campo>
                  )}
                </div>
                {g.tipo === 'luz' && (
                  <p className="mt-2 text-xs text-stone-500">
                    Con tu recibo: tarifa = total del recibo ÷ kWh consumidos.
                    Los watts vienen en la etiqueta del horno o la batidora.
                  </p>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-sm font-semibold text-amber-900">
                    {fmt(costoGasto(g))}
                  </span>
                  <button
                    className={btnGhost}
                    onClick={() =>
                      setGastos((l) => l.filter((i) => i.id !== g.id))
                    }
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              className={btnSoft}
              onClick={() => agregarGasto('luz')}
            >
              + Luz
            </button>
            <button
              className={btnSoft}
              onClick={() => agregarGasto('gas')}
            >
              + Gas
            </button>
            <button
              className={btnSoft}
              onClick={() => agregarGasto('transporte')}
            >
              + Transporte
            </button>
            <button
              className={btnSoft}
              onClick={() => agregarGasto('otro')}
            >
              + Otro
            </button>
          </div>
          <p className="mt-3 text-right text-sm text-stone-500">
            Total: <b className="text-stone-800">{fmt(totalGastos)}</b>
          </p>
        </section>

        {/* 4 Rendimiento */}
        <section className={card}>
          <Titulo n="4">Rendimiento y ganancia</Titulo>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Rebanadas que salen">
              {numInput(rebanadas, setRebanadas, { inputMode: 'numeric' })}
            </Campo>
            <Campo label="Margen de ganancia (%)">
              {numInput(margen, setMargen)}
            </Campo>
          </div>
        </section>

        {/* Resultado */}
        <section className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-amber-900">Resultado</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-stone-500">Costo de la preparación</p>
              <p className="text-lg font-semibold text-stone-800">
                {fmt(costoTotal)}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Costo por rebanada</p>
              <p className="text-lg font-semibold text-stone-800">
                {fmt(costoRebanada)}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Vender completo a</p>
              <p className="text-2xl font-bold text-amber-700">
                {fmt(precioCompleto)}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Vender cada rebanada a</p>
              <p className="text-2xl font-bold text-amber-700">
                {fmt(precioRebanada)}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-stone-600">
            Ganancia por preparación: <b>{fmt(precioCompleto - costoTotal)}</b>
          </p>
        </section>
      </main>

      {/* Barra fija */}
      <div className="fixed inset-x-0 bottom-0 border-t border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-stone-400">
              Completo
            </p>
            <p className="text-lg font-bold text-stone-800">
              {fmt(precioCompleto)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-stone-400">
              Por rebanada
            </p>
            <p className="text-lg font-bold text-amber-700">
              {fmt(precioRebanada)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
