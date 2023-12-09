// apiHelpers.js

export const updateWorkOrder = async (workOrderDetails) => {
  try {
    const response = await fetch('/api/work-orders', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workOrderDetails),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      return { success: true, data }
    } else {
      throw new Error(data.error || 'Failed to update work order')
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
