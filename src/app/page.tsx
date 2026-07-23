"use client";

import { useState, useEffect } from "react";

const rules = [
  {
    id: "1.0",
    title: "Дискредитация сервера",
    desc: "Пытаться как то перегнать людей из нашего сервера, рекламировать что то свое без соглашения, необоснованно критиковать сервер",
  },
  {
    id: "1.1",
    title: 'Шутки про "Коч", "Голду", "Одинцово"',
    desc: "Это не смешно это тупо и неуместно особенно спам этим говном в чат или войс = бан пермачем",
  },
  {
    id: "1.2",
    title: "Спам неуместным или несмешным саундпадом",
    desc: 'Например включать какое то дерьмицо по типу ремиксов "Коч Коч" или какие то бразильские фонки, неактуальные мемасики',
  },
  {
    id: "1.3",
    title: "Неадекватное поведение",
    desc: "По факту правило для галочки но ложить людей как хомиградера на землю для проверки нельзя",
  },
  {
    id: "1.4",
    title: "Писклявый, неразборчивый, непонятный, не слушабельный войсмод",
    desc: "Такого каждого в пермач на первый раз предупреждение",
  },
  {
    id: "1.5",
    title: "Мониторинг информации через дискорд (Метагейминг)",
    desc: "Нельзя нахуй другу говорить где типы и кто трейтор",
  },
  {
    id: "1.6",
    title: "Таргетинг каждый раунд",
    desc: "Если вас убили не обижайтесь это всего лишь игра",
  },
  {
    id: "1.7",
    title: "Читерство эксплойты и прочее что дает преимущество",
    desc: "Для этого существуют реморс сервера с покупными админками, там и читерите пожалуйста",
  },
  {
    id: "1.8",
    title: "Нацизм, терроризм, расизм",
    desc: "В рамках разумного и небольших шуток но не творить дичь по типу группировок МКУ которые рдмят всех либо определенных личностей",
  },
  {
    id: "1.9",
    title: "Лауд-войс",
    desc: "Не смешно бассубстить микрофон и пердеть в него",
  },
  {
    id: "2.0",
    title: "Багоюз",
    desc: "Залазить под карту или в места где без фейка не пролезть и тянуть раунд",
  },
];

interface ServerStats {
  name: string;
  map: string;
  gamemode: string;
  numplayers: number;
  maxplayers: number;
  bots: number;
  status: boolean;
  connect: string;
  ip: string;
  port: number;
  points: number;
  position_game: number;
  country: string;
}

export default function Home() {
  const [steamId, setSteamId] = useState("");
  const [amount, setAmount] = useState("10");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [paymentData, setPaymentData] = useState<{ paymentId: number; steamId64: string; donateUrl: string } | null>(null);
  const [stats, setStats] = useState<ServerStats | null>(null);

  useEffect(() => {
    fetch("https://api.gamemonitoring.ru/servers/12359817")
      .then((r) => r.json())
      .then((d) => setStats(d.response))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steamId, amount: Number(amount) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error ?? "Ошибка" });
      } else {
        setPaymentData({ paymentId: data.paymentId, steamId64: data.steamId64, donateUrl: data.donateUrl });
      }
    } catch {
      setMessage({ type: "err", text: "Не удалось отправить запрос" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden px-4 py-8">
      <div className="absolute inset-0 grid-bg" />

      <div className="relative z-10 w-full max-w-4xl">
        {/* ── Header ── */}
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white text-xl font-black text-black shadow-lg shadow-white/10">
              V
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              VANILLA<span className="text-neutral-400">+</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              className="action-button"
              href="https://gamemonitoring.ru/garrys-mod/servers/12359817/connect"
              target="_blank"
              rel="noopener noreferrer"
            >
              Подключиться
            </a>
            <a className="action-button" href="https://discord.gg/N2fKWTTuY" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2914a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
              </svg>
              Discord
            </a>
          </div>
        </div>

        <p className="mb-8 text-center text-sm text-neutral-500">
          Пополнение аккаунта на сервере Garry&apos;s Mod
        </p>

        {/* ── Stats + Form ── */}
        <div className="mb-8 flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center">
          {/* Server stats card */}
          <div className="w-full max-w-xs rounded-2xl border border-neutral-800 bg-black/60 p-5 shadow-xl backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                Статистика
              </h3>
              {stats ? (
                <span className="flex items-center gap-1.5 text-xs">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      stats.status ? "bg-green-500 shadow-[0_0_6px_#22c55e]" : "bg-red-500"
                    }`}
                  />
                  {stats.status ? "Online" : "Offline"}
                </span>
              ) : (
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-neutral-600" />
              )}
            </div>

            {stats ? (
              <>
                {/* Name */}
                <p className="mb-3 text-sm font-bold leading-tight text-white">
                  {stats.name}
                </p>

                {/* Map + Gamemode */}
                <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-2">
                    <span className="block text-neutral-500">Карта</span>
                    <span className="font-semibold text-white">{stats.map}</span>
                  </div>
                  <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-2">
                    <span className="block text-neutral-500">Режим</span>
                    <span className="font-semibold text-white">{stats.gamemode}</span>
                  </div>
                </div>

                {/* Players */}
                <div className="mb-3">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-neutral-500">Игроки</span>
                    <span className="font-semibold text-white">
                      {stats.numplayers}/{stats.maxplayers}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all"
                      style={{
                        width: `${Math.min((stats.numplayers / stats.maxplayers) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* IP */}
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-xs">
                  <span className="block text-neutral-500">IP</span>
                  <span className="font-mono font-semibold text-white">{stats.connect}</span>
                </div>

                {/* Bottom row: points + position */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-2">
                    <span className="block text-neutral-500">Очки</span>
                    <span className="font-bold text-white">{stats.points}</span>
                  </div>
                  <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-2">
                    <span className="block text-neutral-500"># Рейтинг</span>
                    <span className="font-bold text-white">{stats.position_game}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-600 border-t-white" />
              </div>
            )}
          </div>

          {paymentData ? (
            <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-black/60 p-6 shadow-xl backdrop-blur-md">
              <div className="mb-4 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 text-green-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Заказ #{paymentData.paymentId} создан</h3>
                <p className="mt-1 text-sm text-neutral-400">Сейчас вы будете перенаправлены на DonationAlerts</p>
              </div>

              <div className="mb-4 flex items-center justify-center py-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-600 border-t-white" />
              </div>

              <button
                onClick={() => window.location.href = paymentData.donateUrl}
                className="w-full rounded-lg bg-white px-4 py-3 font-semibold text-black transition hover:bg-neutral-200"
              >
                Перейти к оплате
              </button>

              <button
                onClick={() => setPaymentData(null)}
                className="mt-2 w-full rounded-lg border border-neutral-800 px-4 py-3 text-sm text-neutral-400 transition hover:text-white"
              >
                Назад
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md rounded-2xl border border-neutral-800 bg-black/60 p-6 shadow-xl backdrop-blur-md"
            >
              <div className="relative mb-5">
                <div className="mb-1 flex items-center gap-2">
                  <label className="block text-sm font-medium text-neutral-300">
                    Steam ID
                  </label>
                  <div className="group relative">
                    <span className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-neutral-600 text-[10px] font-bold text-neutral-400 transition hover:border-neutral-400 hover:text-neutral-200">
                      ?
                    </span>
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-center text-xs text-neutral-300 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                      Воспользуйтесь кнопкой "Скопировать SteamID" в донат-меню в F4
                      <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-neutral-700" />
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  value={steamId}
                  onChange={(e) => setSteamId(e.target.value)}
                  placeholder="STEAM_0:1:12345678"
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-white placeholder-neutral-600 outline-none transition focus:border-white/50 focus:ring-1 focus:ring-white/20"
                />
              </div>

              <label className="mb-1 block text-sm font-medium text-neutral-300">
                Сумма пополнения (₽)
              </label>
              <input
                type="number"
                min={10}
                step={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="от 10 рублей"
                className="mb-2 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-white placeholder-neutral-600 outline-none transition focus:border-white/50 focus:ring-1 focus:ring-white/20"
              />
              <p className="mb-5 text-xs text-neutral-600">Минимальная сумма — 10 рублей</p>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-white px-4 py-3 font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Обработка..." : "Оплатить"}
              </button>

              {message && (
                <div
                  className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                    message.type === "ok"
                      ? "border border-white/10 bg-white/5 text-white"
                      : "border border-red-500/10 bg-red-500/10 text-red-400"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </form>
          )}
        </div>

        {/* ── Rules ── */}
        <div className="rounded-2xl border border-neutral-800 bg-black/60 p-6 shadow-xl backdrop-blur-md">
          <h2 className="mb-6 text-center text-xl font-bold">Правила сервера</h2>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="border-b border-neutral-800 pb-4 last:border-0 last:pb-0">
                <div className="mb-1 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-md bg-white/10 px-2 py-0.5 text-xs font-semibold text-white/70">
                    {rule.id}
                  </span>
                  <span className="font-semibold text-white">{rule.title}</span>
                </div>
                <p className="text-sm text-neutral-400">{rule.desc}</p>
              </div>
            ))}
            <div className="border-t border-neutral-800 pt-4 text-sm italic text-neutral-500">
              Оскорблять администрацию если что можно.
            </div>
            <div className="text-sm italic text-neutral-500">P.S А так свобода действий</div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-center text-xs text-neutral-600">
          <p>© VANILLA+ · Garry&apos;s Mod Server</p>
          <a href="/oferta_691110484906.docx" target="_blank" className="underline transition hover:text-neutral-400">
            Публичная оферта
          </a>
        </div>
      </div>
    </main>
  );
}
