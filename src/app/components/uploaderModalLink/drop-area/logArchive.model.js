export class LogArchive {
  constructor(file) {
    this.file = file;

    const parsedFileName = this.parseName(this.file);
    this.fileName = file.name;
    this.jobName = parsedFileName.jobName;
    this.buildNumber = parsedFileName.buildNumber;
  }

  parseName(file) {
    const splittedName = this.getFileName(file).split('-');
    const ret = {jobName: splittedName[0], buildNumber: splittedName[1]};

    return ret;
  }

  getFileName(file) {
    const reg=/(.*)(?:\.([^.]+$))/;
    return file.name.match(reg)[1];
  }

  validate() {
    if (this.file.type != 'application/zip') {
      throw new Error('File type must be "application/zip".');
    }

    if (this.buildNumber == null || !/^\d+$/.test(this.buildNumber)) {
      throw new Error('Invalid file name. File name must be <JENKINS_JOB_NAME>-<JENKINS_BUILD_NUMBER> (e.x. job-100)');
    }
  }
}
