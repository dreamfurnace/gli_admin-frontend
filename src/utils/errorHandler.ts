// GLI Admin Error Handler
import { useToast } from 'vue-toastification';
import type { ApiError } from '@/types/api';

export class ErrorHandler {
  private toast = useToast();

  handleApiError(error: any, context?: string): ApiError {
    console.error(`🚨 GLI API Error${context ? ` (${context})` : ''}:`, error);

    let apiError: ApiError;

    if (error.response) {
      // 서버에서 응답한 에러
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          apiError = {
            message: data?.message || 'Invalid request data',
            code: 'BAD_REQUEST',
            details: data,
          };
          break;
        case 401:
          apiError = {
            message: 'Authentication required',
            code: 'UNAUTHORIZED',
            details: data,
          };
          break;
        case 403:
          apiError = {
            message: 'Access denied',
            code: 'FORBIDDEN',
            details: data,
          };
          break;
        case 404:
          apiError = {
            message: 'Resource not found',
            code: 'NOT_FOUND',
            details: data,
          };
          break;
        case 429:
          apiError = {
            message: 'Too many requests, please try again later',
            code: 'RATE_LIMITED',
            details: data,
          };
          break;
        case 500:
          apiError = {
            message: 'Internal server error',
            code: 'SERVER_ERROR',
            details: data,
          };
          break;
        default:
          apiError = {
            message: data?.message || `Server error (${status})`,
            code: 'SERVER_ERROR',
            details: data,
          };
      }
    } else if (error.request) {
      // 네트워크 에러
      apiError = {
        message: 'Network connection failed',
        code: 'NETWORK_ERROR',
        details: { request: error.request },
      };
    } else {
      // 기타 에러
      apiError = {
        message: error.message || 'Unknown error occurred',
        code: 'UNKNOWN_ERROR',
        details: error,
      };
    }

    // 사용자에게 토스트 메시지 표시 (401은 제외 - 인증 관련은 별도 처리)
    if (apiError.code !== 'UNAUTHORIZED') {
      this.showErrorToast(apiError, context);
    }

    return apiError;
  }

  private showErrorToast(error: ApiError, context?: string) {
    const message = context 
      ? `${context}: ${error.message}`
      : error.message;

    this.toast.error(message, {
      timeout: 5000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
    });
  }

  showSuccessToast(message: string) {
    this.toast.success(message, {
      timeout: 3000,
      closeOnClick: true,
    });
  }

  showWarningToast(message: string) {
    this.toast.warning(message, {
      timeout: 4000,
      closeOnClick: true,
    });
  }

  showInfoToast(message: string) {
    this.toast.info(message, {
      timeout: 3000,
      closeOnClick: true,
    });
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();