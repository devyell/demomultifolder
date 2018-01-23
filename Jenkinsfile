pipeline {
  agent any
  stages {
    stage('build') {
      environment {
        commit = '$(git show -s --pretty=%an)'
      }
      steps {
        bat 'echo %commit%'
      }
    }
  }
  environment {
    commit = '${GIT_COMMIT}'
  }
}