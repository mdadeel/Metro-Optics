import { toast } from '@/hooks/use-toast'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const handleApiError = (error: any): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input.'
      case 401:
        return 'You need to be logged in to perform this action.'
      case 403:
        return 'You do not have permission to perform this action.'
      case 404:
        return 'The requested resource was not found.'
      case 409:
        return 'This action conflicts with existing data.'
      case 429:
        return 'Too many requests. Please try again later.'
      case 500:
        return 'Server error. Please try again later.'
      default:
        return error.data?.error || error.message || 'An unexpected error occurred.'
    }
  }
  
  if (error.name === 'NetworkError' || error.message.includes('fetch')) {
    return 'Network error. Please check your internet connection.'
  }
  
  return error.message || 'An unexpected error occurred.'
}

export const safeApiCall = async <T>(
  apiCall: () => Promise<T>,
  errorHandler?: (error: any) => string
): Promise<{ data?: T; error?: string }> => {
  try {
    const data = await apiCall()
    return { data }
  } catch (error) {
    const errorMessage = errorHandler ? errorHandler(error) : handleApiError(error)
    return { error: errorMessage }
  }
}

// Hook for API calls with error handling
export const useApiCall = () => {
  const call = async <T>(
    apiCall: () => Promise<T>,
    options?: {
      successMessage?: string
      errorMessage?: string
      showSuccessToast?: boolean
      showErrorToast?: boolean
    }
  ): Promise<{ data?: T; error?: string }> => {
    const {
      successMessage,
      errorMessage,
      showSuccessToast = true,
      showErrorToast = true
    } = options || {}

    try {
      const data = await apiCall()
      
      if (showSuccessToast && successMessage) {
        toast({
          title: "Success",
          description: successMessage,
        })
      }
      
      return { data }
    } catch (err) {
      const errorMsg = errorMessage || handleApiError(err)
      
      if (showErrorToast) {
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        })
      }
      
      return { error: errorMsg }
    }
  }

  return { call }
}

// Validation error handler
export const handleValidationError = (error: any): string => {
  if (error?.issues && Array.isArray(error.issues)) {
    return error.issues.map((issue: any) => issue.message).join(', ')
  }
  return 'Validation failed. Please check your input.'
}

// Form error handler
export const handleFormError = (error: any, fieldName?: string): string => {
  if (error?.issues && Array.isArray(error.issues)) {
    const fieldError = error.issues.find((issue: any) => 
      issue.path.includes(fieldName)
    )
    return fieldError?.message || 'Invalid input'
  }
  return 'Please check this field'
}