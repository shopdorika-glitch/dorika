export default function ShopLoading() {
  return (
    <div className="bg-paper">
      <div className="border-b border-line">
        <div className="shell pb-10 pt-6 lg:pb-14 lg:pt-8">
          <div className="skeleton h-3 w-28" />
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="skeleton h-3 w-24" />
              <div className="skeleton mt-4 h-10 w-72 max-w-full" />
            </div>
            <div className="skeleton h-12 w-full max-w-sm" />
          </div>
        </div>
      </div>

      <div className="shell">
        <div className="flex h-[62px] items-center justify-between border-y border-line">
          <div className="flex gap-3">
            {[64, 52, 72, 56].map((w, i) => (
              <div key={i} className="skeleton h-3" style={{ width: w }} />
            ))}
          </div>
          <div className="skeleton hidden h-8 w-40 sm:block" />
        </div>

        <div className="py-5">
          <div className="skeleton h-3 w-24" />
        </div>

        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton aspect-square w-full" />
              <div className="mt-4 border-t border-line pt-4">
                <div className="skeleton h-2.5 w-20" />
                <div className="skeleton mt-3 h-4 w-40" />
                <div className="skeleton mt-2 h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
