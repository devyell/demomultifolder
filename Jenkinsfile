pipeline {
  agent any
  stages {
    stage('build') {
      environment {
        commit = 'env.GIT_COMMIT'
      }
      steps {
        bat 'echo commit'
      }
    }
  }
  environment {
    commit = 'env.GIT_COMMIT'
  }
}