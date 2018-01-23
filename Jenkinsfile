pipeline {
  agent any
  stages {
    stage('build') {
      environment {
        commit = 'cmd git show -s --pretty=%an'
      }
      steps {
        bat 'echo %commit%'
      }
    }
  }
}