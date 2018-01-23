node {
    stage('checkout'){
        checkout([$class: 'GitSCM', branches: [[name: '*/*']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '5f1f1f52-bc95-4ce0-a419-7be7b1f8d6b4', url: 'https://github.com/devyell/demomultifolder.git']]])
    }
    stage('build') {
        if (env.BRANCH_NAME == 'master') {
            
           def gitEcho= bat returnStdout: true, script: 'git log --name-status -1'
           def workspace = pwd()
           def changes= gitEcho.tokenize('\n').findAll { (it.startsWith('M') || it.startsWith('A'))}
           def f=folderModified(workspace,changes)
            command = "copy $workspace\\$f c:\\$f"
            echo command
            if(f){
            def sourceDir = "$workspace\\$f"
            def destinationDir = "c:\\$f"
            (new AntBuilder().copy(todir: destinationDir) {
                    fileset(dir: sourceDir)
                })
            }else{
                echo "ningun scriptportlet se ha modificado"
            }
        
        } else {
            echo 'I execute elsewhere'
        }
    }
}

@NonCPS
def folderModified(ws,lstChanges) {
    def folder=null
   new File(ws).eachDir() { dir ->  
       lstChanges.each{
           if(it.contains(dir.getName())){
                folder=dir.getName()
               echo dir.getName()
                echo folder
           }
       }
       
   }  
    echo folder
   return folder 
}
