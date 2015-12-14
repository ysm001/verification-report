export class LogArchive {
  constructor(file) {
    this.file = file;
    const ret = this.parseName(this.file);

    this.jobName = ret.jobName;
    this.buildNumber = ret.buildNumber;
    console.log(ret);
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
