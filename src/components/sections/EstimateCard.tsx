'use client';

import { useMemo, useState } from 'react';
import { useLocale } from '@/context/LocaleProvider';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import type { Dictionary } from '@/locales';

/**
 * Floating estimate card.
 *
 * Overlaps the lower boundary of the hero, then the trust bar sits directly
 * beneath it. Three fields and one button.
 *
 * The WhatsApp message is composed silently on every change and carried on the
 * anchor's href, so the visitor sees a normal form and lands in a chat with
 * everything already typed. There is no message preview, no submit endpoint and
 * no state to lose.
 */

type CategoryKey = keyof Dictionary['intake']['categories'];
type ScopeKey = keyof Dictionary['intake']['scopes'];

const CATEGORY_KEYS: CategoryKey[] = ['commercial', 'retail', 'villa', 'apartment'];
const SCOPE_KEYS: ScopeKey[] = ['routine', 'deep', 'movein', 'technical'];

const FIELD =
  'focus-ring-field min-h-[52px] w-full rounded-xl border border-hairline bg-white px-4 py-3 ' +
  'text-[15px] text-ink transition-[border-color,box-shadow] duration-150 ease-feedback ' +
  'hover:border-faint placeholder:text-faint';

export function EstimateCard() {
  const { t, locale } = useLocale();
  const [category, setCategory] = useState<CategoryKey>('commercial');
  const [scope, setScope] = useState<ScopeKey>('routine');
  const [phone, setPhone] = useState('');

  const href = useMemo(() => {
    const entered = phone.trim();
    return generateWhatsAppLink(
      'estimate',
      {
        [t.intake.category]: t.intake.categories[category],
        [t.intake.scope]: t.intake.scopes[scope],
        [t.intake.phone]: entered.length > 0 ? entered : t.intake.fallbackNumber,
      },
      { locale },
    );
  }, [t, category, scope, phone, locale]);

  return (
    <div className="container-page relative z-[40] -mt-14 sm:-mt-16 lg:-mt-20">
      <section
        id="intake"
        role="region"
        aria-labelledby="intake-title"
        className="rounded-[20px] border border-hairline-soft bg-white p-[clamp(20px,3vw,34px)] shadow-intake"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id="intake-title" className="font-display text-[clamp(21px,2.4vw,28px)] font-bold text-ink">
            {t.intake.title}
          </h2>
          <p className="spec max-w-[46ch]">{t.intake.note}</p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]">
          <div>
            <label htmlFor="estimate-category" className="spec mb-2 block">
              {t.intake.category}
            </label>
            <select
              id="estimate-category"
              value={category}
              onChange={(event) => setCategory(event.target.value as CategoryKey)}
              className={`${FIELD} select-field`}
            >
              {CATEGORY_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t.intake.categories[key]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="estimate-scope" className="spec mb-2 block">
              {t.intake.scope}
            </label>
            <select
              id="estimate-scope"
              value={scope}
              onChange={(event) => setScope(event.target.value as ScopeKey)}
              className={`${FIELD} select-field`}
            >
              {SCOPE_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t.intake.scopes[key]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="estimate-phone" className="spec mb-2 block">
              {t.intake.phone}
            </label>
            <input
              id="estimate-phone"
              type="tel"
              inputMode="tel"
              dir="ltr"
              autoComplete="tel"
              placeholder={t.intake.phonePlaceholder}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={FIELD}
            />
          </div>

          {/* An anchor, not a submit. The message is already composed. */}
          <div className="flex items-end">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.a11y.whatsappEstimate}
              className="focus-ring-light u-press tap flex min-h-[52px] w-full items-center justify-center whitespace-nowrap rounded-xl bg-deep px-7 font-display text-[15px] font-semibold text-white shadow-deep transition-colors duration-fast ease-feedback hover:bg-blue xl:w-auto"
            >
              {t.intake.submit}
            </a>
          </div>
        </div>

        <ul className="hair-light-t mt-5 flex flex-wrap items-center gap-x-7 gap-y-2 pt-4">
          {[
            t.intake.assurances.free,
            t.intake.assurances.noObligation,
            t.intake.assurances.inHouse,
          ].map((item) => (
            <li key={item} className="spec inline-flex items-center gap-2.5">
              <span aria-hidden="true" className="bullet-inline" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default EstimateCard;
