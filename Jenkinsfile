node {
    stage('build') {
        if (env.BRANCH_NAME == 'master') {
            def gitEcho= bat returnStdout: true, script: 'git log --name-status -2'
            echo 'I only execute on the master branch'
            println gitEcho.split('\n').findAll { it.startsWith('M') }
        } else {
            echo 'I execute elsewhere'
        }
    }
}
