export default function Input({ name, type = 'text', defaultValue, label, className, children }) {

  const autoComplete = type === 'password' ? 'current-password' : 'none'

  return (
    <div className={`grid grid-cols-1 ${className ?? ''}`}>
      <label
        className='pl-3 text-xs text-gray-800 col-span-full'
        htmlFor={name}>{label}</label>
      <div className='flex'>
        <input
          className='p-1 pl-2 m-1 outline-none bg-gray-200 rounded grow'
          type={type} id={name} name={name} defaultValue={defaultValue} autoComplete={autoComplete} />
        {children}
      </div>
    </div>
  )
}
