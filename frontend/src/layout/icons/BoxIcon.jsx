export default function BoxIcon({className, size=18}){
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4.0a2 2 0 0 0 2 0l7-4.0A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M3.27 6.96L12 11l8.73-4.04" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
