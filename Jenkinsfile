pipeline {
  agent any
  stages {
    stage('build') {
      environment {
        COMMIT = bat 'git log --name-status -1 --oneline'
      }
      steps {
        bat 'echo  %COMMIT%'
      }
    }
  }
}
