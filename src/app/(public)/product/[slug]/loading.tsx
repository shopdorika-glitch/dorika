export default function ProductLoading() {
  return (
    <div className="bg-paper">
      <div className="shell pt-6 lg:pt-8">
        <div className="skeleton h-3 w-56" />
      </div>
      <div className="shell grid gap-10 pb-16 pt-8 lg:grid-cols-12 lg:gap-14 lg:pb-24 lg:pt-12">
        <div className="lg:col-span-7">
          <div className="skeleton aspect-square w-full" />
          <div className="mt-4 flex justify-between">
            <div className="skeleton h-2.5 w-40" />
            <div className="skeleton h-2.5 w-24" />
          </div>
        </div>
        <div className="space-y-4 lg:col-span-5">
          <div className="skeleton h-2.5 w-24" />
          <div className="skeleton h-10 w-full max-w-sm" />
          <div className="skeleton h-6 w-28" />
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-12 w-full" />
          <div className="skeleton mt-8 h-40 w-full" />
        </div>
      </div>
    </div>
  );
}
