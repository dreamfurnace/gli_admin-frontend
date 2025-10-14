// 관리자 활동 로깅 서비스
import api from '@/utils/axios';
class LoggingService {
    getClientInfo() {
        return {
            ip_address: 'unknown', // 실제로는 서버에서 처리
            user_agent: navigator.userAgent,
        };
    }
    /**
     * 관리자 활동 로그 기록
     */
    async logAdminActivity(adminId, adminUsername, action, resourceType, resourceId, details, severity = 'INFO') {
        try {
            const logEntry = {
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
        }
        catch (error) {
            console.error('❌ Failed to log admin activity:', error);
            // 로깅이 실패해도 메인 기능은 계속 동작해야 함
        }
    }
    /**
     * 로그인 활동 로그
     */
    async logLogin(adminId, adminUsername, success) {
        await this.logAdminActivity(adminId, adminUsername, success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED', 'AUTH', undefined, { success }, success ? 'INFO' : 'WARNING');
    }
    /**
     * 로그아웃 활동 로그
     */
    async logLogout(adminId, adminUsername) {
        await this.logAdminActivity(adminId, adminUsername, 'LOGOUT', 'AUTH');
    }
    /**
     * 데이터 수정 활동 로그
     */
    async logDataModification(adminId, adminUsername, action, resourceType, resourceId, oldData, newData) {
        await this.logAdminActivity(adminId, adminUsername, action, resourceType, resourceId, { oldData, newData }, 'INFO');
    }
    /**
     * 권한 관련 활동 로그
     */
    async logPermissionAction(adminId, adminUsername, action, targetUserId, details) {
        await this.logAdminActivity(adminId, adminUsername, action, 'PERMISSION', targetUserId, details, 'WARNING');
    }
    /**
     * 시스템 설정 변경 로그
     */
    async logSystemConfigChange(adminId, adminUsername, configKey, oldValue, newValue) {
        await this.logAdminActivity(adminId, adminUsername, 'CONFIG_CHANGE', 'SYSTEM', configKey, { oldValue, newValue }, 'WARNING');
    }
    /**
     * 관리자 로그 조회
     */
    async getAdminLogs(filter = {}) {
        try {
            const response = await api.get('/api/admin/logs/', { params: filter });
            return response.data;
        }
        catch (error) {
            console.error('❌ Failed to fetch admin logs:', error);
            throw error;
        }
    }
    /**
     * 특정 관리자의 최근 활동 조회
     */
    async getRecentActivity(adminId, limit = 10) {
        try {
            const response = await this.getAdminLogs({
                admin_id: adminId,
                limit,
            });
            return response.logs;
        }
        catch (error) {
            console.error('❌ Failed to fetch recent activity:', error);
            return [];
        }
    }
    /**
     * 보안 이벤트 로그 (높은 중요도)
     */
    async logSecurityEvent(adminId, adminUsername, event, details) {
        await this.logAdminActivity(adminId, adminUsername, `SECURITY_${event}`, 'SECURITY', undefined, details, 'CRITICAL');
    }
    /**
     * 에러 로그
     */
    async logError(adminId, adminUsername, errorType, errorMessage, stackTrace) {
        await this.logAdminActivity(adminId, adminUsername, 'ERROR', 'SYSTEM', errorType, { errorMessage, stackTrace }, 'ERROR');
    }
}
export const loggingService = new LoggingService();
//# sourceMappingURL=logging.js.map