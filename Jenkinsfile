pipeline {
  agent {
    node {
      label 'master'
    }

  }
  stages {
    stage('Build Dev') {
      when {
        branch 'dev'
      }
      steps {
        sh (
          script: '''
yarn
yarn build
cd /service
npm run stop-test
npm run start-test
''',
          label: "yarn build"
        )
      }
    }
    stage('Build Master') {
      when {
        branch 'master'
      }
      steps {
        sh (
          script: '''
yarn
yarn build
cd /service
npm run stop
npm run start
''',
          label: "yarn build"
        )
      }
    }
    stage('Deploy to test environment') {
      when {
        branch 'dev'
      }
      steps {
        sh (script: '''
sudo rm -rf /www/explorer-v2/conflux-scan
sudo cp -r /var/lib/jenkins/workspace/conflux-scan_dev /www/explorer-v2/conflux-scan
''' ,
            label: 'replace old site with the newly built one')
      }
    }
    stage('Deploy to production environment') {
      when {
        branch 'master'
      }
      steps {
        input 'Deploy to production environment? (Click "Proceed" to continue)'
        sh (
          script: '''sudo scp /www/explorer-v2/conflux-scan centos@13.57.216.190:/www/explorer-v2/''',
          label: 'scp test website to prod machine'
        )
      }
    }
  }
}