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
        interface ErrorWithOptionalData {
          data?: { error?: string };
          message?: string;
        }
        const errorWithOptionalData = error as ErrorWithOptionalData
        return errorWithOptionalData.data?.error || errorWithOptionalData.message || 'An unexpected error occurred.'
    }
  }
  
  const errorObj = error as { name?: string; message?: string }
  if (errorObj.name === 'NetworkError' || (errorObj.message && errorObj.message.includes('fetch'))) {
    return 'Network error. Please check your internet connection.'
  }
  
  return (error as { message?: string }).message || 'An unexpected error occurred.'
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
  if (error && typeof error === 'object' && 'issues' in error && Array.isArray((error as { issues: unknown[] }).issues)) {
    return (error as { issues: { message: string }[] }).issues.map((issue: unknown) => {
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
  if (error && typeof error === 'object' && 'issues' in error && Array.isArray((error as { issues: unknown[] }).issues)) {
    const fieldError = (error as { issues: { path: string[] }[] }).issues.find((issue: unknown) => 
      issue && typeof issue === 'object' && 'path' in issue && Array.isArray((issue as { path: string[] }).path) && fieldName && (issue as { path: string[] }).path.includes(fieldName)
    );
    if (fieldError && typeof fieldError === 'object' && 'message' in fieldError) {
      return (fieldError as { message: string }).message || 'Invalid input';
    }
  }
  return 'Please check this field';
}