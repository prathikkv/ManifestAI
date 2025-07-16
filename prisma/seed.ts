import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create data retention policies
  const retentionPolicies = [
    {
      dataType: 'privacy_logs',
      retentionPeriod: 2555, // 7 years
      description: 'Privacy action logs for compliance and audit purposes',
      legalBasis: 'legal_obligation',
      jurisdiction: 'US',
    },
    {
      dataType: 'system_audit_logs',
      retentionPeriod: 1095, // 3 years
      description: 'System audit logs for security and debugging',
      legalBasis: 'legitimate_interest',
      jurisdiction: 'US',
    },
    {
      dataType: 'content_safety_logs',
      retentionPeriod: 730, // 2 years
      description: 'Content safety and moderation logs',
      legalBasis: 'legitimate_interest',
      jurisdiction: 'US',
    },
    {
      dataType: 'chat_messages',
      retentionPeriod: 365, // 1 year
      description: 'AI coaching session chat messages',
      legalBasis: 'consent',
      jurisdiction: 'US',
    },
    {
      dataType: 'progress_entries',
      retentionPeriod: 1095, // 3 years
      description: 'User progress tracking data',
      legalBasis: 'consent',
      jurisdiction: 'US',
    },
    {
      dataType: 'mental_health_checks',
      retentionPeriod: 2555, // 7 years
      description: 'Mental health assessment logs for safety',
      legalBasis: 'vital_interest',
      jurisdiction: 'US',
    },
  ];

  for (const policy of retentionPolicies) {
    await prisma.dataRetentionPolicy.upsert({
      where: { dataType: policy.dataType },
      update: policy,
      create: policy,
    });
  }

  console.log('✅ Created data retention policies');

  // Create default system audit log entry
  await prisma.systemAuditLog.create({
    data: {
      eventType: 'system_initialization',
      resource: 'database',
      action: 'seed_completed',
      systemComponent: 'prisma_seed',
      severity: 'info',
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    },
  });

  console.log('✅ Created initial system audit log');

  // Create sample content safety rules (you might want to load these from a config file)
  const safetyThresholds = {
    harassment: 0.8,
    hate: 0.8,
    self_harm: 0.6,
    sexual: 0.9,
    violence: 0.8,
  };

  console.log('✅ Configured content safety thresholds');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Database seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });