
node {
    stage('Git'){
		checkout([
		     $class: 'GitSCM',
		     branches: scm.branches,
		     doGenerateSubmoduleConfigurations: scm.doGenerateSubmoduleConfigurations,
		     extensions: scm.extensions,
		     userRemoteConfigs: scm.userRemoteConfigs
		  ])
		  
    }
    stage('Build'){
        sh 'npm install'
        sh 'gulp build'
    }
    if(env.BRANCH_NAME == 'main')
    {
        stage('Publish'){
            sh 'rsync -viza --checksum --delete build/ root@plutus.srv.qsolution.ru:/srv/www/htdocs/demo/'
        }
    }
}
