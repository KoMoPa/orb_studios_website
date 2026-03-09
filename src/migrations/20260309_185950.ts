import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "rooms" DROP COLUMN "info_box_monthly_rate";
  ALTER TABLE "rooms" DROP COLUMN "info_box_monthly_rate_label";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "rooms" ADD COLUMN "info_box_monthly_rate" varchar;
  ALTER TABLE "rooms" ADD COLUMN "info_box_monthly_rate_label" varchar DEFAULT 'Monthly Rate';`)
}
