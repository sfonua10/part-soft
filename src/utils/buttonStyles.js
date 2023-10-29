export const baseButtonStyles =
  'w-full rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-gray-50 sm:order-last sm:w-auto'

export const getButtonStyles = (condition) => {
  return `${baseButtonStyles} ${
    condition
      ? 'border-gray-400 text-gray-700'
      : 'cursor-not-allowed border-gray-300 text-gray-400'
  }`
}

export const getIconStyles = (condition) => {
  return condition ? 'h-6 text-gray-700' : 'h-6 text-gray-400'
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
