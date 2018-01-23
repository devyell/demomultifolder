pipeline {
  agent any
  stages {
    stage('build') {
      environment {
        commit = '${GIT_COMMIT}'
      }
      steps {
        bat 'echo env.commit'
      }
    }
  }
  environment {
    commit = '${GIT_COMMIT}'
  }
}