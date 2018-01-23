node {
    stage('build') {
        if (env.BRANCH_NAME == 'master') {
            def gitEcho= bat returnStdout: true, script: 'git log --name-status -3'
            echo 'I only execute on the master branch'
            println gitEcho.tokenize('\n')
            println gitEcho.tokenize('\n').findAll { it.startsWith('M') }
        } else {
            echo 'I execute elsewhere'
        }
    }
}
