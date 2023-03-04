import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

// Reference: https://docs.nestjs.com/techniques/task-scheduling
@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);
    private taskName: string = 'updateMarketPlaceCron';
    constructor(
        private readonly configService: ConfigService,
        private schedulerRegistry: SchedulerRegistry
    ) { }

    runScheduledTask(runTask, skuData: string[]) {
        let job: CronJob = this.schedulerRegistry.getCronJob(this.taskName);
        let isFirstUpload = true;
        if (job) {
            this.schedulerRegistry.deleteCronJob(this.taskName);
            isFirstUpload = false;
        }

        job = new CronJob(CronExpression.EVERY_10_MINUTES, () => {
            runTask(skuData, isFirstUpload);
        });

        this.schedulerRegistry.addCronJob(this.taskName, job);
        job.start();
        this.logger.log('Scheduled task started');
    }

    cancelScheduledTask() {
        const job = this.schedulerRegistry.getCronJob(this.taskName);
        if (job) {
            job.stop();
            this.schedulerRegistry.deleteCronJob(this.taskName);

            this.logger.log('Scheduled task stopped');
        }
    }
}
