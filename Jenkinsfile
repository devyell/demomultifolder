pipeline {
  agent any
  stages {
    stage('build') {
      environment {
        commit = bat 'git log --name-status -1 --oneline'
      }
      steps {
        bat 'echo ${commit}'
      }
    }
  }
}
