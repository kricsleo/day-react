import clsx from 'clsx'
import { useHourState } from '../hooks/hours'

export default function Hours() {
  const maxHour = 8
  const hourState = useHourState()
  const translateX = -(hourState.hour - 1) * 100
  const disableDecrease = hourState.hour === 1
  const disableIncrease = hourState.hour === maxHour

  return (
    <div className="y-center gap-sm" title={`每天工作${hourState.hour}小时`}>
      <div className="y-center">
        <button
          className={clsx(
            'rotate-30 i-ph:triangle-light relative top--1.5 text-xs',
            disableDecrease ? 'text-muted/65' : 'hover:i-ph:triangle-fill',
            { 'cursor-not-allowed': disableDecrease },
          )}
          disabled={disableDecrease}
          onClick={disableDecrease ? undefined : hourState.decrease}
        />

        <div className="w-20 of-hidden">
          <ul className="y-center ws-nowrap transition" style={{ transform: `translateX(${translateX}%)` }}>
            {Array.from({ length: maxHour }, (_, idx) => (
              <li className="w-20 x-center shrink-0" key={idx}>{idx + 1}</li>
            ))}
          </ul>
        </div>

        <button
          className={clsx(
            'rotate--30 i-ph:triangle-light relative top--1.5 text-xs',
            disableIncrease ? 'text-muted/65' : 'hover:i-ph:triangle-fill',
            { 'cursor-not-allowed': disableIncrease },
          )}
          disabled={disableIncrease}
          onClick={disableIncrease ? undefined : hourState.increase}
        />
      </div>

      <span>hours/day</span>
    </div>
  )
}
