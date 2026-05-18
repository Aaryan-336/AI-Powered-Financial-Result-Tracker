"use client";

export default function NewsFeed() {
  const news = [
    { title: "TCS launches AI automation tools", source: "Economic Times", time: "2h ago" },
    { title: "HDFC Bank beats Q3 expectations", source: "Mint", time: "5h ago" },
    { title: "Reliance invests $1.2B into green hydrogen", source: "Business Standard", time: "1d ago" }
  ];

  return (
    <aside className="w-96 bg-white/80 backdrop-blur-xl p-6 border-l border-gray-200 overflow-y-auto hidden lg:block">
      <h2 className="text-xl font-bold text-green-600 mb-4">News</h2>
      <div className="flex flex-col gap-4">
        {news.map((item, i) => (
          <div key={i} className="p-4 bg-white border border-gray-300 rounded-xl shadow-sm">
            <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{item.source} • {item.time}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
