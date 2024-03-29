export default function Tooltip({ value, enabled, children }) {
   return enabled ? (
      <span className='has-tooltip relative cursor-pointer border-b border-dotted border-b-gray-700'>
         {children}
         <div className='tooltip absolute hidden cursor-auto pt-3 left-1/2 -translate-x-1/2 w-max'>
            <div className='bg-gray-800 rounded-md text-gray-50 p-3'>
               {value}
            </div>
         </div>
      </span>
   ) : <>{children}</>
}
