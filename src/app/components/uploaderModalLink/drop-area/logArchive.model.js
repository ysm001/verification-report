export class LogArchive {
  constructor(file) {
    this.file = file;

    const parsedFileName = this.parseName(this.file);
    this.fileName = file.name;
    this.jobName = parsedFileName.jobName;
    this.buildNumber = parsedFileName.buildNumber;
  }

  parseName(file) {
    const reg = /^([^-]+)-(\d+).zip$/;
    const match = file.name.match(reg) || [];
    const ret = {jobName: match[1], buildNumber: match[2]};

    return ret;
  }

  getFileName(file) {
    const reg=/(.*)(?:\.([^.]+$))/;
    return file.name.match(reg)[1];
  }

  validate() {
    if (this.file.type != 'application/zip') {
      return 'File type must be "application/zip".';
    }

    if (this.buildNumber == null || !/^\d+$/.test(this.buildNumber)) {
      return 'Invalid file name. File name must be <JENKINS_JOB_NAME>-<JENKINS_BUILD_NUMBER>.zip (e.x. job-100.zip)';
    }
  }
}
