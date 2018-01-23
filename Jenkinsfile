node {
    stage('build') {
        if (env.BRANCH_NAME == 'master') {
            def gitEcho= bat returnStdout: true, script: 'git log --name-status -1'
            echo 'I only execute on the master branch'
            println gitEcho.tokenize('\n').length
        } else {
            echo 'I execute elsewhere'
        }
    }
}
