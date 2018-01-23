pipeline {
  agent any
  stages {
    stage('build') {
      environment {
        commit = '${GIT_COMMIT}'
      }
      steps {
        bat 'echo commit'
      }
    }
  }
  environment {
    commit = '${GIT_COMMIT}'
  }
}