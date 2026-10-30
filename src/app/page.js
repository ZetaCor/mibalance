'use client';
import { useEffect, useState } from 'react';

const num = (v) => parseFloat(v) || 0;
const UNIDADES = ['g', 'kg', 'ml', 'l', 'unid'];

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

const field = 'w-full border border-gray-400 bg-white p-2 text-base text-black';
const box = 'border border-gray-400 p-3 mb-3';
const btn = 'border border-gray-500 bg-gray-100 px-3 py-2 text-sm text-black';

function Campo({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs text-gray-700">{label}</span>
      {children}
    </label>
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

  return (
    <main className="mx-auto max-w-2xl bg-white p-3 text-black">
      <h1 className="mb-3 text-xl font-bold">MiBalance</h1>

      <section className={box}>
        <h2 className="mb-2 font-bold">1. Producto</h2>
        <div className="grid grid-cols-2 gap-2">
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
          <Campo label="Moneda">
            <input
              className={field}
              value={moneda}
              onChange={(e) => setMoneda(e.target.value)}
            />
          </Campo>
        </div>
      </section>

      <section className={box}>
        <h2 className="mb-1 font-bold">2. Insumos</h2>
        <p className="mb-2 text-xs text-gray-700">
          Precio y cantidad del envase completo, y cuánto usa la receta (misma
          unidad). Si el sobrante se pierde, marca la casilla y se cobra el
          envase completo.
        </p>
        {insumos.map((x) => (
          <div
            key={x.id}
            className="mb-3 border-t border-gray-300 pt-2"
          >
            <Campo label="Insumo">
              <input
                className={field}
                value={x.nombre}
                onChange={(e) => setI(x.id, 'nombre', e.target.value)}
              />
            </Campo>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Campo label="Precio del envase">
                <input
                  className={field}
                  type="number"
                  inputMode="decimal"
                  value={x.precio}
                  onChange={(e) => setI(x.id, 'precio', e.target.value)}
                />
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
                <input
                  className={field}
                  type="number"
                  inputMode="decimal"
                  value={x.envase}
                  onChange={(e) => setI(x.id, 'envase', e.target.value)}
                />
              </Campo>
              <Campo label="Cantidad que usa">
                <input
                  className={field}
                  type="number"
                  inputMode="decimal"
                  value={x.usada}
                  onChange={(e) => setI(x.id, 'usada', e.target.value)}
                />
              </Campo>
            </div>
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={x.desperdicio}
                onChange={(e) => setI(x.id, 'desperdicio', e.target.checked)}
              />
              El sobrante se pierde
            </label>
            <div className="mt-2 flex items-center justify-between">
              <b>{fmt(costoInsumo(x))}</b>
              <button
                className={btn}
                onClick={() =>
                  setInsumos((l) => l.filter((i) => i.id !== x.id))
                }
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
        <button
          className={btn}
          onClick={agregarInsumo}
        >
          + Agregar insumo
        </button>
        <p className="mt-2 text-right">
          Total insumos: <b>{fmt(totalInsumos)}</b>
        </p>
      </section>

      <section className={box}>
        <h2 className="mb-1 font-bold">3. Gastos fijos por preparación</h2>
        <p className="mb-2 text-xs text-gray-700">
          Agrega solo los que apliquen.
        </p>
        {gastos.map((g) => (
          <div
            key={g.id}
            className="mb-3 border-t border-gray-300 pt-2"
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
                    <input
                      className={field}
                      type="number"
                      inputMode="decimal"
                      value={g.watts}
                      onChange={(e) => setG(g.id, 'watts', e.target.value)}
                    />
                  </Campo>
                  <Campo label="Horas de uso">
                    <input
                      className={field}
                      type="number"
                      inputMode="decimal"
                      value={g.horas}
                      onChange={(e) => setG(g.id, 'horas', e.target.value)}
                    />
                  </Campo>
                  <Campo label="Tarifa por kWh">
                    <input
                      className={field}
                      type="number"
                      inputMode="decimal"
                      value={g.tarifa}
                      onChange={(e) => setG(g.id, 'tarifa', e.target.value)}
                    />
                  </Campo>
                </>
              )}
              {g.tipo === 'gas' && (
                <>
                  <Campo label="Precio de la bombona">
                    <input
                      className={field}
                      type="number"
                      inputMode="decimal"
                      value={g.bombona}
                      onChange={(e) => setG(g.id, 'bombona', e.target.value)}
                    />
                  </Campo>
                  <Campo label="Preparaciones que rinde">
                    <input
                      className={field}
                      type="number"
                      inputMode="decimal"
                      value={g.preparaciones}
                      onChange={(e) =>
                        setG(g.id, 'preparaciones', e.target.value)
                      }
                    />
                  </Campo>
                </>
              )}
              {(g.tipo === 'transporte' || g.tipo === 'otro') && (
                <Campo label="Monto por preparación">
                  <input
                    className={field}
                    type="number"
                    inputMode="decimal"
                    value={g.monto}
                    onChange={(e) => setG(g.id, 'monto', e.target.value)}
                  />
                </Campo>
              )}
            </div>
            {g.tipo === 'luz' && (
              <p className="mt-2 text-xs text-gray-700">
                Con tu recibo: tarifa = total del recibo ÷ kWh consumidos. Los
                watts vienen en la etiqueta del equipo.
              </p>
            )}
            <div className="mt-2 flex items-center justify-between">
              <b>{fmt(costoGasto(g))}</b>
              <button
                className={btn}
                onClick={() => setGastos((l) => l.filter((i) => i.id !== g.id))}
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          <button
            className={btn}
            onClick={() => agregarGasto('luz')}
          >
            + Luz
          </button>
          <button
            className={btn}
            onClick={() => agregarGasto('gas')}
          >
            + Gas
          </button>
          <button
            className={btn}
            onClick={() => agregarGasto('transporte')}
          >
            + Transporte
          </button>
          <button
            className={btn}
            onClick={() => agregarGasto('otro')}
          >
            + Otro
          </button>
        </div>
        <p className="mt-2 text-right">
          Total gastos fijos: <b>{fmt(totalGastos)}</b>
        </p>
      </section>

      <section className={box}>
        <h2 className="mb-2 font-bold">4. Rendimiento y ganancia</h2>
        <div className="grid grid-cols-2 gap-2">
          <Campo label="Rebanadas que salen">
            <input
              className={field}
              type="number"
              inputMode="numeric"
              value={rebanadas}
              onChange={(e) => setRebanadas(e.target.value)}
            />
          </Campo>
          <Campo label="Margen de ganancia (%)">
            <input
              className={field}
              type="number"
              inputMode="decimal"
              value={margen}
              onChange={(e) => setMargen(e.target.value)}
            />
          </Campo>
        </div>
      </section>

      <section className="border-2 border-black p-3">
        <h2 className="mb-2 font-bold">Resultado</h2>
        <p>
          Costo total de la preparación: <b>{fmt(costoTotal)}</b>
        </p>
        <p>
          Costo por rebanada: <b>{fmt(costoRebanada)}</b>
        </p>
        <p className="mt-2 text-lg">
          Precio de venta (completo): <b>{fmt(precioCompleto)}</b>
        </p>
        <p className="text-lg">
          Precio por rebanada: <b>{fmt(precioRebanada)}</b>
        </p>
        <p className="mt-2 text-sm">
          Ganancia por preparación: {fmt(precioCompleto - costoTotal)}
        </p>
      </section>
    </main>
  );
}
