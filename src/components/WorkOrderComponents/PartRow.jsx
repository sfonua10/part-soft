export function PartRow({ response }) {
    const getPartAvailabilityStyles = (availability) => {
        switch (availability) {
          case 'In Stock':
            return {
              background: 'bg-green-50',
              text: 'text-green-700',
              ring: 'ring-green-600/20',
            }
          case 'Out of Stock':
            return {
              background: 'bg-red-50',
              text: 'text-red-700',
              ring: 'ring-red-600/20',
            }
          case 'Pending':
            return {
              background: 'bg-orange-50',
              text: 'text-orange-700',
              ring: 'ring-orange-600/20',
            }
          default:
            return {} // Default styles, if any
        }
      }
    const styles = getPartAvailabilityStyles(response.availability);
    return (
        <tr key={response._id}>
        <td className="px-3 py-4 text-sm text-gray-900">
          {response.vendorName}
        </td>
        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
          <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${styles.text} ${styles.background} ${styles.ring}`}
          >
            {response.availability}
          </span>
        </td>
        <td className="px-3 py-4 text-sm text-gray-500">
          {response.orderStatus}
        </td>
        <td className="px-3 py-4 text-sm text-gray-500">
          {response.price}
        </td>
        <td className="px-3 py-4 text-sm text-gray-500">
          {response.delivery}
        </td>
        <td className="px-3 py-4 text-sm text-gray-500">
          {response.partAvailable}
        </td>
      </tr>
    );
  }