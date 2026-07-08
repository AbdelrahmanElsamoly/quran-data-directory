'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ResourceFilters } from '@/components/resources/ResourceFilters';
import { ResourceGrid } from '@/components/resources/ResourceGrid';
import { SearchBar } from '@/components/resources/SearchBar';
import { SortControls } from '@/components/resources/SortControls';
import { Pagination } from '@/components/ui/Pagination';
import { useResources } from '@/hooks/useResources';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { useLanguage } from '@/i18n';
import type { SortOption } from '@/types/resource';

export function CatalogContent() {
  const searchParams = useSearchParams();
  const { locale, direction } = useLanguage();
  const type = searchParams.get('type') || undefined;
  const license = searchParams.get('license') || undefined;
  const itqan_badge = searchParams.get('itqan_badge') || undefined;
  const search = searchParams.get('search') || undefined;
  const sort = (searchParams.get('sort') || undefined) as SortOption | undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 9;

  const { data, isLoading } = useResources({
    type,
    license,
    itqan_badge,
    search,
    sort,
    page,
    page_size: pageSize,
  });

  const resultCount = data?.results.length ?? 0;
  const totalCount = data?.count ?? 0;

  return (
    <div className="bg-white pb-10 pt-32 text-black sm:pt-36" dir={direction}>
      <main className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[28px] bg-[linear-gradient(118deg,#eef1f1_18%,#dcebf7_100%)] px-5 py-12 text-center sm:px-10 sm:py-14 lg:px-24">
          <h1 className="text-3xl font-black leading-tight sm:text-4xl">
            {locale === 'ar' ? 'مكتبة الموارد' : 'Resource Library'}
          </h1>
          <p className="mt-3 text-xl font-medium leading-relaxed sm:text-3xl">
            {locale === 'ar'
              ? 'مصدر لكل ما تحتاجه لدراساتك القرآنية'
              : 'Everything you need for Quranic studies'}
          </p>
          <div className="mx-auto mt-7 max-w-[900px]">
            <SearchBar initialQuery={search || ''} />
          </div>
        </section>

        <section className="mt-7 grid items-start gap-7 lg:grid-cols-[270px_minmax(0,1fr)]">
          <ResourceFilters />

          <div className="min-w-0">
            <div className="mb-5 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SortControls />
              <p className="text-lg font-black sm:text-xl">
                {locale === 'ar'
                  ? `عرض ${resultCount} من ${totalCount} مورد${search ? ` لـ “${search}”` : ''}`
                  : `Showing ${resultCount} of ${totalCount} resources${search ? ` for “${search}”` : ''}`}
              </p>
            </div>

            {isLoading ? (
              <ListSkeleton count={9} />
            ) : data?.results.length ? (
              <>
                <ResourceGrid resources={data.results} />
                <Pagination count={data.count} pageSize={pageSize} />
              </>
            ) : (
              <div className="rounded-2xl border border-[#ececec] py-20 text-center">
                <p className="text-lg font-black">
                  {locale === 'ar' ? 'لم يتم العثور على موارد' : 'No resources found'}
                </p>
                <p className="mt-2 text-sm text-[#8c8c8c]">
                  {locale === 'ar'
                    ? 'جرّب تعديل البحث أو الفلاتر.'
                    : 'Try adjusting your search or filters.'}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-24 overflow-hidden rounded-[24px] bg-[linear-gradient(112deg,#edf1f1_15%,#dbeaf6_100%)] px-7 sm:px-12">
          <div className="grid items-stretch md:min-h-[340px] gap-8 md:grid-cols-[330px_1fr]" dir="ltr">
            <div className="flex h-[220px] items-end justify-center self-stretch overflow-hidden sm:h-[270px] md:h-full">
              <img
                src="/images/rocket.png"
                alt=""
                className="h-full w-auto max-w-full object-contain object-bottom md:max-w-none"
              />
            </div>
            <div className="flex flex-col items-start justify-center py-10 text-start" dir={direction}>
              <h2 className="text-3xl font-black leading-tight sm:text-5xl">
                {locale === 'ar' ? 'انشر موردك القرآني' : 'Publish your Quranic resource'}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#818181] sm:text-lg">
                {locale === 'ar'
                  ? 'شارك مكتبتك أو أداة التطوير أو مجموعة البيانات مع المجتمع. صِل إلى المطورين الذين يبنون الجيل القادم.'
                  : 'Share your library, development tool, or dataset with the community and reach developers building the next generation.'}
              </p>
              <Link
                href="/dashboard/resources"
                className="mt-7 inline-flex rounded-full bg-black px-10 py-4 text-base font-black text-white transition hover:bg-[#171717]"
              >
                {locale === 'ar' ? 'انشره الآن' : 'Publish now'}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
