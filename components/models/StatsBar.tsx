import { StatItem } from "@/lib/types";

export default function StatsBar({
  stats,
}: {
  eyebrow?: string;
  stats: StatItem[];
}) {
  return (
    <div className="bg-[#0c0c0d] py-10 text-white">
      <div className="container-mhero">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="p-6">
              <p className="text-[11px] font-medium uppercase leading-[1.4] tracking-widest2">{stat.label}</p>
              <p className="mt-3 text-2xl font-medium leading-[1.3]">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
