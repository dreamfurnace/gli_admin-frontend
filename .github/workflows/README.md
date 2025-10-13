# GLI Admin Frontend GitHub Actions 워크플로우

## 필요한 AWS 인프라

배포 전에 다음 AWS 리소스가 필요합니다:

### S3 버킷
```bash
# Staging
aws s3 mb s3://stg-gli-admin-frontend --region ap-northeast-2
aws s3 website s3://stg-gli-admin-frontend --index-document index.html --error-document index.html

# Production
aws s3 mb s3://gli-admin-frontend --region ap-northeast-2
aws s3 website s3://gli-admin-frontend --index-document index.html --error-document index.html

# Production 백업용 버킷
aws s3 mb s3://gli-admin-frontend-backup --region ap-northeast-2
```

### CloudFront 배포
- Staging: `stg-admin.glibiz.com`
- Production: `admin.glibiz.com`
- Origin: 위에서 생성한 S3 버킷
- SSL/TLS 인증서: ACM 인증서 (us-east-1)

### Route53 레코드
- Staging: A 레코드 - `stg-admin.glibiz.com` → CloudFront 배포
- Production: A 레코드 - `admin.glibiz.com` → CloudFront 배포

## 필요한 GitHub Secrets

다음 secrets를 GitHub repository에 설정해야 합니다:

### AWS 자격 증명
- `AWS_ACCESS_KEY_ID` - S3 및 CloudFront 권한이 있는 IAM 사용자
- `AWS_SECRET_ACCESS_KEY`

### S3 버킷
- `STG_ADMIN_S3_BUCKET` - 예: `stg-gli-admin-frontend`
- `PROD_ADMIN_S3_BUCKET` - 예: `gli-admin-frontend`

### CloudFront 배포 ID
- `STG_ADMIN_CF_DISTRIBUTION_ID` - Staging CloudFront 배포 ID
- `PROD_ADMIN_CF_DISTRIBUTION_ID` - Production CloudFront 배포 ID

## 워크플로우 파일

### ✅ 생성 완료
- `deploy-staging.yml` - stg 브랜치 push 시 자동 배포
- `deploy-production.yml` - main 브랜치 push 시 자동 배포

### 주요 기능
- Node.js 22 사용 (Vite 기반 빌드)
- TypeScript 타입 체크
- 프로덕션 최적화 빌드
- S3에 정적 파일 업로드
- CloudFront 캐시 무효화
- Production 배포 시 백업 생성
- 배포 후 헬스 체크

## 배포 흐름

### Staging 배포
```
stg 브랜치 push → GitHub Actions → Vite 빌드 → S3 업로드 → CloudFront 무효화
```

### Production 배포
```
main 브랜치 push → GitHub Actions → Vite 빌드 → S3 백업 → S3 업로드 → CloudFront 무효화 → 헬스 체크
```

## 환경 변수 설정

### .env.staging
```bash
VITE_APP_ENV=staging
VITE_API_BASE_URL=https://stg-api.glibiz.com
```

### .env.production
```bash
VITE_APP_ENV=production
VITE_API_BASE_URL=https://api.glibiz.com
```

## 다음 단계

### 1. S3 버킷 정책 설정
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### 2. CloudFront 배포 생성
- Origin: S3 버킷 웹사이트 엔드포인트
- Viewer Protocol Policy: Redirect HTTP to HTTPS
- Compress Objects Automatically: Yes
- SSL Certificate: ACM 인증서 (us-east-1)
- Default Root Object: index.html

### 3. CloudFront Custom Error Response 설정
- Error Code: 403, 404
- Response Page Path: /index.html
- HTTP Response Code: 200
- (Vue Router의 history mode 지원)

### 4. Route53 레코드 추가
```bash
# Staging
aws route53 change-resource-record-sets \
  --hosted-zone-id Z0419507IHNIDPFGXUPL \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "stg-admin.glibiz.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "<CloudFront-Domain>",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'

# Production
aws route53 change-resource-record-sets \
  --hosted-zone-id Z0419507IHNIDPFGXUPL \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "admin.glibiz.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "<CloudFront-Domain>",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'
```

### 5. GitHub Secrets 설정
리포지토리 Settings → Secrets and variables → Actions에서 설정

### 6. 테스트 배포 실행
```bash
# Staging 테스트
git checkout stg
git push origin stg

# Production 테스트 (신중하게!)
git checkout main
git push origin main
```

## 롤백 절차

### Staging
1. 이전 커밋으로 revert
2. `git push origin stg --force-with-lease`

### Production
1. S3 백업에서 이전 버전 복원:
   ```bash
   aws s3 sync s3://gli-admin-frontend-backup/<timestamp> s3://gli-admin-frontend
   ```

2. CloudFront 캐시 무효화:
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id <DISTRIBUTION_ID> \
     --paths "/*"
   ```

## 모니터링

- GitHub Actions 워크플로우 실행 상태: 리포지토리의 Actions 탭
- CloudFront 무효화 상태: AWS Console → CloudFront → Invalidations
- S3 버킷 상태: AWS Console → S3
- 웹사이트 접근성: https://admin.glibiz.com, https://stg-admin.glibiz.com
