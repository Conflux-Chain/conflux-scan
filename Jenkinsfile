/* -*- mode: groovy -*- */
// dontKillMe
// jenkins will kill any process spawned during the job
// https://wiki.jenkins.io/display/JENKINS/ProcessTreeKiller
pipeline {
  options {
    buildDiscarder logRotator(artifactDaysToKeepStr: '30', artifactNumToKeepStr: '50', daysToKeepStr: '60', numToKeepStr: '50')
    disableConcurrentBuilds()
    disableResume()
    durabilityHint 'PERFORMANCE_OPTIMIZED'
    timestamps()
  }

  agent none

  stages {
    stage('test') {
      agent {label 'bounty-backend-test-machine'}
      steps {
        script {
          sh (label: 'pre-build', script: """
sudo docker build -t conflux-scan .
""")
        }
        script {
          sh (label: 'lint', script: "sudo docker run --rm conflux-scan lint:eslint .")
        }
      }
    }

    stage('multiple env') {
      parallel {
        stage('test env') {
          when {
            beforeAgent true
            anyOf {
              branch 'dev'
              branch 'jenkins-pipeline'
            }
          }
          agent {label 'bounty-backend-test-machine'}
          steps {
            script {
              sh (label: 'build front', script: """
mkdir -p `pwd`/dist
sudo docker run --rm --mount type=bind,src=`pwd`/dist,dst=/conflux-scan/dist conflux-scan build
""")
            }
            script {
              build 'Conflux-dev/conflux-dag/master'
              // this will copy dist/*.js in conflux-dag into dist folder in this workspace
              copyArtifacts(projectName: 'Conflux-dev/conflux-dag/master')
              sh (label: 'move to nginx www', script: """
sudo rm -rf /www/explorer-v2/conflux-scan
sudo mkdir -p /www/explorer-v2/conflux-scan
sudo cp -r .  /www/explorer-v2/conflux-scan/
""")
            }
          }
        }

        stage('debug dev env') {
          when {
            beforeAgent true
            allOf {
              branch 'dev'
            }
          }
          agent {label 'scan-debug-prod-machine'}
          steps {
            script {
              sh (label: 'build front', script: """
sudo docker build -t conflux-scan .
mkdir -p `pwd`/dist
sudo docker run --rm --mount type=bind,src=`pwd`/dist,dst=/conflux-scan/dist conflux-scan build
""")
            }
            script {
              build 'Conflux-dev/conflux-dag/master'
              copyArtifacts(projectName: 'Conflux-dev/conflux-dag/master')
              sh (label: 'move to nginx www', script: """
sudo rm -rf /www/conflux-scan/
sudo mkdir -p /www/conflux-scan/
sudo cp -r . /www/conflux-scan/
""")
            }
          }
        }

        stage('prod env') {
          when {
            beforeAgent true
            allOf {
              branch 'master'
            }
          }
          agent {label 'scan-wallet-prod-machine'}
          steps {
            script {
              sh (label: 'build front', script: """
sudo docker build -t conflux-scan .
mkdir -p `pwd`/dist
sudo docker run --rm --mount type=bind,src=`pwd`/dist,dst=/conflux-scan/dist conflux-scan build
""")
            }
            script {
              build 'Conflux-dev/conflux-dag/master'
              copyArtifacts(projectName: 'Conflux-dev/conflux-dag/master')
              sh (label: 'move to nginx www', script: """
sudo rm -rf /www/explorer-v2/conflux-scan
sudo mkdir /www/explorer-v2/conflux-scan
sudo cp -r . /www/explorer-v2/conflux-scan
""")
            }
          }
        }
      }
    }
  }
}
