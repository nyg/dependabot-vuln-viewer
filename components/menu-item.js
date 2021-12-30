export default function MenuItem({ children }) {
  return (
    <span className='text-xs text-gray-400 hover:text-gray-600 hover:underline'>
      {children}
    </span>
  )
}
