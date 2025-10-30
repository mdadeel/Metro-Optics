import { toast } from '@/hooks/use-toast'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const handleApiError = (error: unknown): string => {
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
  errorHandler?: (error: unknown) => string
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
export const handleValidationError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'issues' in error && Array.isArray((error as any).issues)) {
    return (error as any).issues.map((issue: unknown) => {
      if (issue && typeof issue === 'object' && 'message' in issue) {
        return (issue as { message: string }).message;
      }
      return 'Validation error';
    }).join(', ');
  }
  return 'Validation failed. Please check your input.'
}

// Form error handler
export const handleFormError = (error: unknown, fieldName?: string): string => {
  if (error && typeof error === 'object' && 'issues' in error && Array.isArray((error as any).issues)) {
    const fieldError = (error as any).issues.find((issue: unknown) => 
      issue && typeof issue === 'object' && 'path' in issue && Array.isArray((issue as any).path) && (issue as any).path.includes(fieldName)
    );
    if (fieldError && typeof fieldError === 'object' && 'message' in fieldError) {
      return (fieldError as { message: string }).message || 'Invalid input';
    }
  }
  return 'Please check this field';
}