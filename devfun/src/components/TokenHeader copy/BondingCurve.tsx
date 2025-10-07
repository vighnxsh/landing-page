import { useTokenInfo } from '@/hooks/queries';
import { formatReadablePercentChange } from '@/lib/format/number';
import { cn } from '@/lib/utils2';

type BondingCurveProps = {
  className?: string;
};

export const BondingCurve: React.FC<BondingCurveProps> = ({ className }) => {
  const { data: bondingCurve } = useTokenInfo((data) => data?.bondingCurve);
  if (bondingCurve === undefined || bondingCurve >= 100) {
    return null;
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2 text-2xl text-black">
        Bonding Curve:
        <div className="relative flex items-center">
          {/* Loading bar in front of percentage */}
          <div className="h-2 w-16 bg-neutral-200 rounded-full overflow-hidden mr-2">
            <div
              className="h-full bg-primary transition-all rounded-full"
              style={{ width: `${bondingCurve}%` }}
            />
          </div>
          <span>{formatReadablePercentChange(bondingCurve / 100, { hideSign: 'positive' })}</span>
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-850">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${bondingCurve}%` }}
        />
      </div>
    </div>
  );
};

export const MobileBondingCurve: React.FC<BondingCurveProps> = ({ className }) => {
  const { data: bondingCurve } = useTokenInfo((data) => data?.bondingCurve);
  if (bondingCurve === undefined || bondingCurve >= 100) {
    return null;
  }

  return (
    <div className={cn('flex flex-col gap-1 pt-2', className)}>
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        Graduate status :
        <div className="relative flex items-center">
          {/* Loading bar in front of percentage */}
          <div className="h-1 w-10 bg-neutral-200 rounded-full overflow-hidden mr-2">
            <div
              className="h-full bg-primary transition-all rounded-full"
              style={{ width: `${bondingCurve}%` }}
            />
          </div>
          <span>{formatReadablePercentChange(bondingCurve / 100, { hideSign: 'positive' })}</span>
        </div>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-850">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${bondingCurve}%` }}
        />
      </div>
    </div>
  );
};
