node {
    stage('checkout'){
        checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '5f1f1f52-bc95-4ce0-a419-7be7b1f8d6b4', url: 'https://github.com/devyell/demomultifolder.git']]])
    }
    stage('build') {
        if (env.BRANCH_NAME == 'master') {
            
            def gitEcho= bat returnStdout: true, script: 'git log --name-status -3'
            echo 'I only execute on the master branch'
           new File(".").eachDir() { dir ->  
                    echo dir.getName()
            }  
            println gitEcho.tokenize('\n').findAll { it.startsWith('M') }
        } else {
            echo 'I execute elsewhere'
        }
    }
}
