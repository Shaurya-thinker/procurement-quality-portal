export default function DashboardIcon({className, size=18}){
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="3" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.5" rx="1" />
      <rect x="13" y="3" width="8" height="5.5" stroke="currentColor" strokeWidth="1.5" rx="1" />
      <rect x="13" y="10.5" width="8" height="10.5" stroke="currentColor" strokeWidth="1.5" rx="1" />
      <rect x="3" y="13" width="8" height="7" stroke="currentColor" strokeWidth="1.5" rx="1" />
    </svg>
  )
}
