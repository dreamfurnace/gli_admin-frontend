// 관리자 활동 로깅 서비스
import api from '@/utils/axios';

export interface AdminLogEntry {
  id?: number;
  admin_id: number;
  admin_username: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
}

export interface LogFilter {
  admin_id?: number;
  action?: string;
  resource_type?: string;
  severity?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

class LoggingService {
  private getClientInfo() {
    return {
      ip_address: 'unknown', // 실제로는 서버에서 처리
      user_agent: navigator.userAgent,
    };
  }

  /**
   * 관리자 활동 로그 기록
   */
  async logAdminActivity(
    adminId: number,
    adminUsername: string,
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: Record<string, any>,
    severity: AdminLogEntry['severity'] = 'INFO'
  ): Promise<void> {
    try {
      const logEntry: Omit<AdminLogEntry, 'id' | 'timestamp'> = {
        admin_id: adminId,
        admin_username: adminUsername,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details,
        severity,
        ...this.getClientInfo(),
      };

      await api.post('/api/admin/logs/', logEntry);
      console.log('📝 Admin activity logged:', { action, resourceType, resourceId });
    } catch (error) {
      console.error('❌ Failed to log admin activity:', error);
      // 로깅이 실패해도 메인 기능은 계속 동작해야 함
    }
  }

  /**
   * 로그인 활동 로그
   */
  async logLogin(adminId: number, adminUsername: string, success: boolean): Promise<void> {
    await this.logAdminActivity(
      adminId,
      adminUsername,
      success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
      'AUTH',
      undefined,
      { success },
      success ? 'INFO' : 'WARNING'
    );
  }

  /**
   * 로그아웃 활동 로그
   */
  async logLogout(adminId: number, adminUsername: string): Promise<void> {
    await this.logAdminActivity(
      adminId,
      adminUsername,
      'LOGOUT',
      'AUTH'
    );
  }

  /**
   * 데이터 수정 활동 로그
   */
  async logDataModification(
    adminId: number,
    adminUsername: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    resourceType: string,
    resourceId: string,
    oldData?: Record<string, any>,
    newData?: Record<string, any>
  ): Promise<void> {
    await this.logAdminActivity(
      adminId,
      adminUsername,
      action,
      resourceType,
      resourceId,
      { oldData, newData },
      'INFO'
    );
  }

  /**
   * 권한 관련 활동 로그
   */
  async logPermissionAction(
    adminId: number,
    adminUsername: string,
    action: string,
    targetUserId?: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logAdminActivity(
      adminId,
      adminUsername,
      action,
      'PERMISSION',
      targetUserId,
      details,
      'WARNING'
    );
  }

  /**
   * 시스템 설정 변경 로그
   */
  async logSystemConfigChange(
    adminId: number,
    adminUsername: string,
    configKey: string,
    oldValue: any,
    newValue: any
  ): Promise<void> {
    await this.logAdminActivity(
      adminId,
      adminUsername,
      'CONFIG_CHANGE',
      'SYSTEM',
      configKey,
      { oldValue, newValue },
      'WARNING'
    );
  }

  /**
   * 관리자 로그 조회
   */
  async getAdminLogs(filter: LogFilter = {}): Promise<{
    logs: AdminLogEntry[];
    total: number;
    hasNext: boolean;
  }> {
    try {
      const response = await api.get('/api/admin/logs/', { params: filter });
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch admin logs:', error);
      throw error;
    }
  }

  /**
   * 특정 관리자의 최근 활동 조회
   */
  async getRecentActivity(adminId: number, limit: number = 10): Promise<AdminLogEntry[]> {
    try {
      const response = await this.getAdminLogs({
        admin_id: adminId,
        limit,
      });
      return response.logs;
    } catch (error) {
      console.error('❌ Failed to fetch recent activity:', error);
      return [];
    }
  }

  /**
   * 보안 이벤트 로그 (높은 중요도)
   */
  async logSecurityEvent(
    adminId: number,
    adminUsername: string,
    event: string,
    details: Record<string, any>
  ): Promise<void> {
    await this.logAdminActivity(
      adminId,
      adminUsername,
      `SECURITY_${event}`,
      'SECURITY',
      undefined,
      details,
      'CRITICAL'
    );
  }

  /**
   * 에러 로그
   */
  async logError(
    adminId: number,
    adminUsername: string,
    errorType: string,
    errorMessage: string,
    stackTrace?: string
  ): Promise<void> {
    await this.logAdminActivity(
      adminId,
      adminUsername,
      'ERROR',
      'SYSTEM',
      errorType,
      { errorMessage, stackTrace },
      'ERROR'
    );
  }
}

export const loggingService = new LoggingService();