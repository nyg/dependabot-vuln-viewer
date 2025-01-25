export default function Input({ name, type = 'text', defaultValue, label, className }) {

   const autoComplete = type === 'password' ? 'current-password' : 'none'

   return (
      <div className={`grid grid-cols-1 ${className ?? ''}`}>
         <label
            className='px-3 pb-1 text-xs text-gray-800 col-span-full'
            htmlFor={name}>{label}</label>
         <input
            className='px-3 py-1 outline-hidden bg-gray-200 rounded-sm grow'
            size={1} type={type} id={name} name={name} defaultValue={defaultValue} autoComplete={autoComplete} />
      </div>
   )
}
