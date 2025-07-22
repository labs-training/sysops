// \[cite: [^\]]*\] [cite Start]
const main_title = "AWS SysOps Practice Quiz";
 // --- DATA SOURCE ---
const questions = [
    {
        "number": 1,
        "title": "EC2 Connectivity Timeout (Based on #339)",
        "scenario": "A SysOps administrator launches a new Amazon EC2 Linux instance into a public subnet.  The instance is running, and the administrator has its public IP address.  However, every attempt to connect remotely (e.g., via SSH) results in a connection timeout error. ",
        "questionText": "Which action will allow the SysOps administrator to remotely connect to the instance? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Add a route table entry in the public subnet for the SysOps administrator's IP address. "
            },
            {
                "letter": "B",
                "text": "Add an outbound network ACL rule to allow TCP port 22 for the SysOps administrator's IP address. "
            },
            {
                "letter": "C",
                "text": "Modify the instance security group to allow inbound SSH traffic from the SysOps administrator's IP address. "
            },
            {
                "letter": "D",
                "text": "Modify the instance security group to allow outbound SSH traffic to the SysOps administrator's IP address. "
            }
        ],
        "correctAnswers": ["C"],
        "explanation": "Correct Answer: C \nExplanation: A connection timeout error is a classic sign that a firewall is blocking the traffic before it can reach the destination.  In AWS, the primary firewall protecting an EC2 instance is its Security Group.  By default, security groups deny all inbound traffic.  To connect to a Linux instance using SSH, you must explicitly allow inbound traffic on TCP port 22.  Modifying the security group to add an inbound rule for port 22 from the administrator's specific IP address is the correct and most secure solution. ",
        "wrongExplanation": "Why the others are wrong: \nA: Route tables control the flow of traffic between subnets and to destinations outside the VPC (like the internet via an Internet Gateway).  They do not filter traffic to a specific instance based on port or IP.  The instance is in a public subnet, which should already have a route to the Internet Gateway. \nB: This is incorrect for two reasons.  First, the problem is with inbound traffic to the instance, not outbound.  Second, Network ACLs are stateless, but they are less commonly the cause of initial connection issues than security groups.  The default Network ACL allows all traffic. \nD: The connection attempt is an inbound request to the EC2 instance.  An outbound rule controls traffic leaving the instance.  While outbound rules are important, they are not the cause of this specific problem. "
    },
    {
        "number": 2,
        "title": "Application & Lambda Routing (Based on #338)",
        "scenario": "A company is transitioning a web application from Amazon EC2 instances to an AWS Lambda function.  During the migration, they need to route traffic based on the URL path.  For example, requests to /api/v1/... should go to the old EC2 instances, while requests to /api/v2/... should go to the new Lambda function. ",
        "questionText": "Which solution will meet these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Configure a Gateway Load Balancer. "
            },
            {
                "letter": "B",
                "text": "Configure a Network Load Balancer. "
            },
            {
                "letter": "C",
                "text": "Configure a Network Load Balancer with a regular expression. "
            },
            {
                "letter": "D",
                "text": "Configure an Application Load Balancer. "
            }
        ],
        "correctAnswers": ["D"],
        "explanation": "Correct Answer: D \nExplanation: The key requirement is path-based routing, which is a feature of the application layer (Layer 7) of the OSI model.  An Application Load Balancer (ALB) operates at Layer 7 and is designed for this exact purpose.  It can inspect the content of the request, including the URL path, and route traffic to different target groups based on rules you define.  In this case, you would create one target group for the EC2 instances and another for the Lambda function, with listener rules on the ALB to direct traffic based on the /api/v1 or /api/v2 path. ",
        "wrongExplanation": "Why the others are wrong: \nA: A Gateway Load Balancer is a specialized service used to deploy, scale, and manage third-party virtual network appliances (like firewalls or intrusion detection systems).  It operates at Layer 3 (the network layer) and cannot perform path-based routing. \nB & C: A Network Load Balancer (NLB) operates at Layer 4 (the transport layer).  It is extremely fast but makes routing decisions based on information like IP address, port, and protocol.  It is not aware of application-level content like URL paths and therefore cannot be used for this scenario. "
    },
    {
        "number": 3,
        "title": "Auto Scaling Cooldown Period (Based on #336)",
        "scenario": "A SysOps administrator has an Auto Scaling group using a simple scaling policy based on the RequestCountPerTarget metric.  The administrator observes that the metric threshold was breached twice within a 180-second period.  The Auto Scaling group is using default settings. ",
        "questionText": "How will the number of EC2 instances in this Auto Scaling group be affected in this scenario? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "The Auto Scaling group will launch an additional EC2 instance every time the RequestCount Per Target metric exceeds the predefined limit. "
            },
            {
                "letter": "B",
                "text": "The Auto Scaling group will launch one EC2 instance and will wait for the default cooldown period before launching another instance. "
            },
            {
                "letter": "C",
                "text": "The Auto Scaling group will send an alert to the ALB to rebalance the traffic and not add new EC2 instances until the load is normalized. "
            },
            {
                "letter": "D",
                "text": "The Auto Scaling group will try to distribute the traffic among all EC2 instances before launching another instance. "
            }
        ],
        "correctAnswers": ["B"],
        "explanation": "Correct Answer: B \nExplanation: Simple scaling policies have a cooldown period to prevent the Auto Scaling group from launching or terminating additional instances before the effects of a previous scaling activity are visible.  The default cooldown period is 300 seconds (5 minutes).  When the first alarm triggers, the Auto Scaling group launches a new instance and enters the cooldown period.  Even though the alarm triggers again 180 seconds later, the group will ignore it because it is still within the 300-second cooldown period.  It will not launch a second instance until the cooldown expires. ",
        "wrongExplanation": "Why the others are wrong: \nA: This describes behavior without a cooldown period, which is incorrect for simple scaling policies.  The cooldown period is specifically designed to prevent this kind of rapid, potentially excessive scaling. \nC: The Auto Scaling group's primary function is to adjust the number of instances, not to directly instruct the ALB to rebalance traffic.  The ALB will automatically rebalance traffic as new instances become healthy. \nD: The ALB is responsible for distributing traffic.  The Auto Scaling group's role is to add or remove instances based on the scaling policy. "
    },
    {
        "number": 4,
        "title": "Database Failover (Based on #335)",
        "scenario": "A company's application uses a single Amazon RDS DB instance.  They are concerned about the lack of a failover solution and need to implement one that is automatic and does not lose any committed transactions in the event of a disaster. ",
        "questionText": "Which solution will meet these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create an RDS read replica in the same AWS Region. "
            },
            {
                "letter": "B",
                "text": "Create an RDS read replica in a different AWS Region. "
            },
            {
                "letter": "C",
                "text": "Modify the DB instance to be a Multi-AZ deployment. "
            },
            {
                "letter": "D",
                "text": "Set up a CloudWatch alarm to restart the DB instance if memory utilization is high. "
            }
        ],
        "correctAnswers": ["C"],
        "explanation": "Correct Answer: C \nExplanation: The requirements are for automatic failover and no data loss (zero RPO - Recovery Point Objective).  The AWS feature designed specifically for this is an RDS Multi-AZ deployment.  When you enable Multi-AZ, RDS automatically provisions and maintains a synchronous standby replica in a different Availability Zone (AZ).  All database writes are synchronously replicated to the standby.  If the primary database fails, RDS automatically fails over to the standby replica without any manual intervention and without losing any committed data. ",
        "wrongExplanation": "Why the others are wrong: \nA & B: Read replicas are primarily for scaling read traffic, not for high availability.  They use asynchronous replication, which means there is a small delay (replication lag).  In a failover, any data committed to the primary that hasn't yet been replicated to the replica would be lost.  Furthermore, promoting a read replica to be the new primary is a manual process (or requires custom automation), not an automatic one. \nD: This is a monitoring solution, not a high-availability or failover solution.  Restarting an instance due to high memory usage does not protect against an underlying host or AZ failure and would cause downtime. "
    },
    {
        "number": 5,
        "title": "Centralized Policy Enforcement (Based on #334)",
        "scenario": "A company uses AWS Organizations with separate Organizational Units (OUs) for production and development.  A corporate policy dictates that developers can only use a specific list of approved AWS services within the production account. ",
        "questionText": "What is the MOST operationally efficient solution to control the production account? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create a customer managed policy in AWS Identity and Access Management (IAM). Apply the policy to all users within the production account. "
            },
            {
                "letter": "B",
                "text": "Create a job function policy in AWS Identity and Access Management (IAM). Apply the policy to all users within the production OU. "
            },
            {
                "letter": "C",
                "text": "Create a service control policy (SCP). Apply the SCP to the production OU. "
            },
            {
                "letter": "D",
                "text": "Create an IAM policy. Apply the policy in Amazon API Gateway to restrict the production account. "
            }
        ],
        "correctAnswers": ["C"],
        "explanation": "Correct Answer: C \nExplanation: Service Control Policies (SCPs) are a feature of AWS Organizations designed for this exact purpose.  SCPs offer central control over the maximum available permissions for all accounts in your organization.  By attaching an SCP to the production OU that explicitly denies access to all services except the approved ones, you create a preventative guardrail.  This policy applies to all IAM users and roles in every account within that OU, including the root user, ensuring consistent enforcement with maximum operational efficiency. ",
        "wrongExplanation": "Why the others are wrong: \nA & B: Using IAM policies is less efficient.  You would need to ensure that every single IAM user and role in the production account has this policy attached.  It's easy for a new user or role to be created without the policy, leading to a security gap.  SCPs provide a top-down enforcement that cannot be overridden by IAM administrators within the account. \nD: Amazon API Gateway is a service for creating, publishing, and securing APIs.  It has no capability to enforce broad service-level permissions for an entire AWS account. "
    },
    {
        "number": 6,
        "title": "Automating Service Quota Increases (Based on #332)",
        "scenario": "A company wants to monitor the number of running EC2 instances and automatically request a service quota increase when the count approaches the current limit. ",
        "questionText": "Which solution meets these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create an Amazon CloudWatch alarm to monitor Service Quotas. Configure the alarm to invoke an AWS Lambda function to request a quota increase when the alarm reaches the threshold. "
            },
            {
                "letter": "B",
                "text": "Create an AWS Config rule to monitor Service Quotas. "
            },
            {
                "letter": "C",
                "text": "Create an Amazon CloudWatch alarm to monitor the AWS Health Dashboard. "
            },
            {
                "letter": "D",
                "text": "Create an Amazon CloudWatch alarm to monitor AWS Trusted Advisor service quotas. Configure the alarm to publish a message to an Amazon Simple Notification Service (Amazon SNS) topic to increase the quota. "
            }
        ],
        "correctAnswers": ["A"],
        "explanation": "Correct Answer: A \nExplanation: This solution provides a complete, automated workflow.  Service Quotas integrates with CloudWatch, allowing you to create alarms based on your usage of a service relative to its quota.  When the CloudWatch alarm enters the ALARM state, it can be configured to trigger an AWS Lambda function.  This function can then use the AWS SDK to programmatically call the RequestServiceQuotalncrease API action, fully automating the process. ",
        "wrongExplanation": "Why the others are wrong: \nB: AWS Config is used to assess, audit, and evaluate the configurations of your AWS resources.  It does not monitor usage metrics against quotas. \nC: The AWS Health Dashboard provides information about service health and planned events, not your specific resource usage against quotas. \nD: While Trusted Advisor does check for service limits, and you can create alarms from it, an SNS topic by itself cannot perform an action like requesting a quota increase.  SNS is a pub/sub messaging service; it can notify you or trigger other services (like Lambda), but it doesn't have the logic to make an API call to increase a quota.  The Lambda function in option A is the missing piece that provides the necessary action. "
    },
    {
        "number": 7,
        "title": "Retaining Resources on Stack Deletion (Based on #331)",
        "scenario": "A SysOps administrator uses AWS CloudFormation to manage a stack of EC2 instances.  The administrator needs to ensure that if the CloudFormation stack is deleted, the EC2 instances and all their associated data (on their EBS volumes) are preserved. ",
        "questionText": "Which solution will meet these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Set the Deletion Policy attribute to Snapshot for the EC2 instance resource in the CloudFormation template. "
            },
            {
                "letter": "B",
                "text": "Automate backups by using Amazon Data Lifecycle Manager (Amazon DLM). "
            },
            {
                "letter": "C",
                "text": "Create a backup plan in AWS Backup. "
            },
            {
                "letter": "D",
                "text": "Set the Deletion Policy attribute to Retain for the EC2 instance resource in the CloudFormation template. "
            }
        ],
        "correctAnswers": ["D"],
        "explanation": "Correct Answer: D \nExplanation: The DeletionPolicy is a CloudFormation resource attribute that tells CloudFormation what to do with a resource when its stack is deleted.  By default, most resources are deleted.  Setting DeletionPolicy: Retain instructs CloudFormation to leave the resource intact when the stack is deleted.  This is the direct, built-in mechanism to achieve the desired outcome of keeping the EC2 instance and its data. ",
        "wrongExplanation": "Why the others are wrong: \nA: The Snapshot deletion policy applies to resources that support snapshots, like AWS::EC2::Volume (EBS volumes) and AWS::RDS::DBInstance.  It does not apply directly to the AWS::EC2::Instance resource itself.  While it would save the data on a volume, it would not save the instance. \nB & C: AWS Backup and DLM are excellent services for creating backups and snapshots for disaster recovery and data protection.  However, they do not prevent CloudFormation from deleting the original EC2 instance when the stack is deleted.  They only provide a way to restore the data later.  The requirement is to keep the original instance. "
    },
    {
        "number": 8,
        "title": "Database Recovery and Efficiency (Based on #330)",
        "scenario": "A company runs a MySQL database on a single EC2 instance.  A SysOps administrator needs to find the MOST operationally efficient solution to minimize both potential data loss and recovery time in case of a database failure. ",
        "questionText": "What is the MOST operationally efficient solution that meets these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create a CloudWatch alarm to stop and start the EC2 instance on failure. "
            },
            {
                "letter": "B",
                "text": "Create an Amazon RDS for MySQL Multi-AZ DB instance. Use a MySQL native backup that is stored in Amazon S3 to restore the data to the new database. Update the connection string in the web application. "
            },
            {
                "letter": "C",
                "text": "Create an Amazon RDS for MySQL Single-AZ DB instance with a read replica. "
            },
            {
                "letter": "D",
                "text": "Use Amazon Data Lifecycle Manager (Amazon DLM) to take an hourly snapshot of the EBS volume. "
            }
        ],
        "correctAnswers": ["B"],
        "explanation": "Correct Answer: B \nExplanation: Migrating the database from a self-managed EC2 instance to Amazon RDS for MySQL with Multi-AZ is the most operationally efficient and robust solution.  RDS is a managed service, which offloads operational tasks like patching, backups, and failover.  The Multi-AZ feature provides a hot standby in a different Availability Zone with synchronous replication, ensuring minimal data loss (RPO near zero) and fast, automatic failover (low RTO).  This directly addresses both requirements with the least ongoing administrative effort.  The one-time effort of migrating and updating the connection string is far outweighed by the long-term operational benefits. ",
        "wrongExplanation": "Why the others are wrong: \nA: Stopping and starting an instance might resolve a software issue but does nothing to protect against an underlying hardware or AZ failure.  It's not a high-availability solution. \nC: A read replica uses asynchronous replication, which can lead to data loss during a failover.  Promoting a read replica is also a manual process, increasing recovery time and operational overhead. \nD: While DLM automates snapshots, this solution has a higher RPO (up to one hour of data loss) and a much higher RTO.  Restoring from a snapshot involves creating a new volume and attaching it to a new instance, a manual and time-consuming process compared to the automatic failover of RDS Multi-AZ. "
    },
    {
        "number": 9,
        "title": "Stopping Idle Instances (Based on #329)",
        "scenario": "A SysOps administrator needs to implement a cost-saving solution to automatically stop development EC2 instances when they are not in use.  An instance is considered \"not in use \" if its average CPU utilization is lower than 5% for 30 minutes. ",
        "questionText": "Which solution will meet this requirement? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Assess AWS CloudTrail logs to verify that there is no EC2 API activity. "
            },
            {
                "letter": "B",
                "text": "Create an Amazon CloudWatch alarm to stop the EC2 instances when the average CPU utilization is lower than 5% for a 30-minute period. "
            },
            {
                "letter": "C",
                "text": "Create an Amazon CloudWatch metric to stop the EC2 instances when the VolumeReadBytes metric is lower than 500. "
            },
            {
                "letter": "D",
                "text": "Use AWS Config to invoke a Lambda function to stop the instances based on resource configuration changes. "
            }
        ],
        "correctAnswers": ["B"],
        "explanation": "Correct Answer: B \nExplanation: This is a classic use case for Amazon CloudWatch Alarms.  CloudWatch natively monitors metrics like CPUUtilization for EC2 instances.  You can create an alarm that triggers when a metric crosses a defined threshold for a specified duration.  Crucially, CloudWatch Alarms can be configured to take direct actions, including stopping, terminating, or rebooting an EC2 instance.  This provides a simple, serverless, and operationally efficient way to meet the requirement. ",
        "wrongExplanation": "Why the others are wrong: \nA: AWS CloudTrail is a service that logs API calls made to your account.  It is used for auditing, governance, and compliance, not for monitoring real-time performance metrics like CPU utilization. \nC: VolumeReadBytes is a metric for disk I/O on an EBS volume.  An instance could be idle from a CPU perspective but still have background disk activity, or vice versa.  CPU utilization is the metric specified in the requirement and is a much better indicator of whether the application is actively being used. \nD: AWS Config is a service that tracks changes to your resource configurations.  It is used for compliance and configuration management.  It does not monitor performance metrics and would not be triggered by low CPU usage. "
    },
    {
        "number": 10,
        "title": "RDS Connection Pooling (Based on #328)",
        "scenario": "A company's application using an RDS for MySQL Multi-AZ instance is frequently reporting \"too many connections \" errors.  A SysOps administrator needs to resolve this with minimal code changes and in the most cost-effective way. ",
        "questionText": "Which solution will meet these requirements MOST cost-effectively? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Modify the RDS for MySQL DB instance to a larger instance size. "
            },
            {
                "letter": "B",
                "text": "Modify the RDS for MySQL DB instance to Amazon DynamoDB. "
            },
            {
                "letter": "C",
                "text": "Configure RDS Proxy. Modify the application configuration file to use the RDS Proxy endpoint. "
            },
            {
                "letter": "D",
                "text": "Modify the RDS for MySQL DB instance to a memory optimized DB instance. "
            }
        ],
        "correctAnswers": ["C"],
        "explanation": "Correct Answer: C \nExplanation: The \"too many connections \" error indicates that the application is opening and closing connections inefficiently or holding too many connections open, exhausting the database's limit.  RDS Proxy is a fully managed, highly available database proxy that is specifically designed to solve this problem.  It sits between the application and the database, pooling and sharing database connections.  This improves application scalability and resilience by making it more efficient with connection management.  The only change required is updating the application's connection endpoint to point to the proxy, which meets the \"minimal code changes \" requirement. ",
        "wrongExplanation": "Why the others are wrong: \nA & D: Scaling the instance up to a larger or memory-optimized size might increase the maximum number of connections, but it's a costly solution that doesn't fix the root cause of inefficient connection management.  The application could still exhaust the new, higher limit.  RDS Proxy is more cost-effective and addresses the actual problem. \nB: Migrating from a relational database (MySQL) to a NoSQL database (DynamoDB) is a massive undertaking that would require a complete application rewrite.  This violates the \"minimal code changes \" requirement. "
    },
    {
        "number": 11,
        "title": "Lambda Internet and VPC Access (Based on #327)",
        "scenario": "A Lambda function, which currently runs outside a VPC and accesses the internet, is being modified.  It now needs to store data in an RDS database located in a private subnet of a VPC.  The function must maintain its ability to access the internet. ",
        "questionText": "Which solution meets these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create a new Lambda function with VPC access and an Elastic IP address. "
            },
            {
                "letter": "B",
                "text": "Create a new Lambda function with VPC access and two public IP addresses. "
            },
            {
                "letter": "C",
                "text": "Reconfigure the Lambda function for VPC access. Add NAT gateways to the public subnets. Add route table entries in the private subnets to route through the NAT gateways. Attach the function to the private subnets. "
            },
            {
                "letter": "D",
                "text": "Reconfigure the Lambda function for VPC access. Attach the function to the private subnets. Add route table entries in the private subnets to route through the internet gateway. "
            }
        ],
        "correctAnswers": ["C"],
        "explanation": "Correct Answer: C \nExplanation: To access a resource inside a VPC (like an RDS instance in a private subnet), the Lambda function must be configured for VPC access and placed in a subnet within that VPC.  Placing it in the private subnet allows it to communicate directly with the RDS instance.  However, resources in a private subnet cannot access the internet directly.  The standard AWS architecture to grant internet access to resources in a private subnet is to use a NAT Gateway.  The NAT Gateway resides in a public subnet and has a route to the Internet Gateway.  The private subnet's route table is then configured to send all internet-bound traffic (0.0.0.0/0) to the NAT Gateway.  This setup allows the Lambda function to reach both the private RDS instance and the public internet. ",
        "wrongExplanation": "Why the others are wrong: \nA & B: Lambda functions cannot be assigned public or Elastic IP addresses.  Placing the function in a public subnet would not allow it to access the RDS instance in the private subnet without complex peering or other networking setups. \nD: Resources in a private subnet cannot have a route directly to an Internet Gateway.  That is the definition of a public subnet.  This configuration would not work. "
    },
    {
        "number": 12,
        "title": "Centralized Multi-Account Alerting (Based on #326)",
        "scenario": "A company uses AWS Organizations and needs a centralized solution to create standard CloudWatch alarms in all accounts and send alerts to a central logging account when a metric crosses a threshold. ",
        "questionText": "Which solution will meet these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Deploy an AWS CloudFormation stack set to the accounts in the organization. Use a template that creates the required CloudWatch alarms and references an SNS topic in the logging account. "
            },
            {
                "letter": "B",
                "text": "Deploy an AWS CloudFormation stack in each account. "
            },
            {
                "letter": "C",
                "text": "Deploy an AWS Lambda function on a cron job in each account. "
            },
            {
                "letter": "D",
                "text": "Deploy an AWS CloudFormation change set to the organization. "
            }
        ],
        "correctAnswers": ["A"],
        "explanation": "Correct Answer: A \nExplanation: AWS CloudFormation StackSets are designed for this exact use case.  A StackSet allows you to create, update, or delete stacks across multiple accounts and regions with a single operation.  You can define a template for your standard CloudWatch alarms and then deploy this template as a StackSet to all accounts within a specific OU or the entire organization.  The template can be configured to send notifications to a centralized SNS topic in the logging account (provided the necessary cross-account permissions are set up).  This is the most scalable and operationally efficient solution. ",
        "wrongExplanation": "Why the others are wrong: \nB & C: Deploying resources manually or with individual scripts in each account is the opposite of a centralized, operationally efficient solution.  It would be difficult to manage and ensure consistency. \nD: A CloudFormation change set is a preview of the changes a stack update will make.  It does not deploy resources across multiple accounts.  StackSets are the correct tool for multi-account deployments. "
    },
    {
        "number": 13,
        "title": "Alarm for All Unhealthy ALB Targets (Based on #325)",
        "scenario": "A SysOps administrator needs to create a CloudWatch alarm that triggers only when all target instances registered with an Application Load Balancer (ALB) are unhealthy. ",
        "questionText": "Which condition should be used with the alarm? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "AWS/ApplicationELB HealthyHostCount <= 0 "
            },
            {
                "letter": "B",
                "text": "AWS/ApplicationELB UnHealthyHostCount >= 1 "
            },
            {
                "letter": "C",
                "text": "AWS/EC2 StatusCheckFailed <= 0 "
            },
            {
                "letter": "D",
                "text": "AWS/EC2 StatusCheckFailed >= 1 "
            }
        ],
        "correctAnswers": ["A"],
        "explanation": "Correct Answer: A \nExplanation: The requirement is to trigger an alarm when all hosts are unhealthy.  The most direct way to measure this is to check the number of healthy hosts.  The HealthyHostCount metric for an ALB's target group tracks the number of healthy instances.  If all instances are unhealthy, this count will be zero.  Therefore, setting an alarm to trigger when HealthyHostCount is less than or equal to O (<=0) precisely matches the condition. ",
        "wrongExplanation": "Why the others are wrong: \nB: The UnHealthyHostCount >= 1 condition would trigger an alarm if even a single instance becomes unhealthy.  The requirement is for all instances to be unhealthy. \nC & D: These are EC2 metrics, not ALB metrics.  While related, they monitor the health of an individual instance from the EC2 perspective, not from the perspective of the ALB's health checks.  The ALB could mark an instance as unhealthy (e.g., the application is not responding) even if the EC2 status checks are passing.  The ALB metrics are the correct ones to use for this scenario. "
    },
    {
        "number": 14,
        "title": "Scaling a CPU-Heavy Application (Based on #322)",
        "scenario": "A legacy, CPU-intensive application runs on a single t3.large EC2 instance and can only be scaled vertically.  The instance is experiencing 90% CPU usage and performance latency. ",
        "questionText": "What change should be made to alleviate the performance problem? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Change the Amazon EBS volume to Provisioned IOPS. "
            },
            {
                "letter": "B",
                "text": "Upgrade to a compute-optimized instance. "
            },
            {
                "letter": "C",
                "text": "Add additional t2.large instances to the application. "
            },
            {
                "letter": "D",
                "text": "Purchase Reserved Instances. "
            }
        ],
        "correctAnswers": ["B"],
        "explanation": "Correct Answer: B \nExplanation: The problem is clearly stated as high CPU usage (90%) causing a performance bottleneck.  The application is \"CPU-heavy. \"  The most direct solution is to provide the application with more CPU power.  Compute-optimized instance families (like the C-family, e.g., c5.large) are specifically designed for compute-bound applications that require high-performance processors.  Upgrading to an instance from this family will directly address the CPU bottleneck.  This aligns with the \"vertical scaling \" constraint. ",
        "wrongExplanation": "Why the others are wrong: \nA: Changing the EBS volume type addresses disk I/O performance.  Since the bottleneck is CPU, this change would likely have no impact on the problem. \nC: The question explicitly states the application can only be scaled vertically (increasing the size/power of a single instance), not horizontally (adding more instances).  This option violates that constraint. \nD: Purchasing Reserved Instances is a billing construct that provides a discount in exchange for a commitment to use EC2.  It does not change the performance or specifications of the instance itself. "
    },
    {
        "number": 15,
        "title": "Private EC2 Instance Internet Connectivity (Based on #318)",
        "scenario": "A SysOps administrator launches an EC2 instance in a private subnet.  When trying to run a curl command to an external website (https://www.example.com), the connection fails. ",
        "questionText": "What should the SysOps administrator do to resolve this issue? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Ensure that there is an outbound security group for port 443 to 0.0.0.0/0. "
            },
            {
                "letter": "B",
                "text": "Ensure that there is an inbound security group for port 443 from 0.0.0.0/0. "
            },
            {
                "letter": "C",
                "text": "Ensure that there is an outbound network ACL for ephemeral ports 1024-65535 to 0.0.0.0/0. "
            },
            {
                "letter": "D",
                "text": "Ensure that there is an outbound network ACL for port 80 to 0.0.0.0/0. "
            }
        ],
        "correctAnswers": ["A"],
        "explanation": "Correct Answer: A \nExplanation: This is a tricky question that tests the fundamentals of security groups and network ACLS.  1. The Core Problem: An instance in a private subnet needs a NAT Gateway (or NAT Instance) and a corresponding route in its subnet's route table to reach the internet.  This is the most fundamental missing piece, though not an option.  2. Analyzing the Options: We must assume a NAT Gateway exists and the routing is correct, and the problem lies with the firewalls.  3. Security Groups (Stateful): A curl to https://www.example.com is an outbound request on port 443 (HTTPS).  By default, a security group's outbound rules allow all traffic.  However, if this default has been removed, you would need to explicitly add an outbound rule allowing traffic on TCP port 443 to the internet (0.0.0.0/0).  Because security groups are stateful, this single outbound rule is sufficient; the return traffic is automatically allowed.  Given the options, the most plausible and direct firewall rule that would cause this issue if misconfigured is the outbound security group rule. ",
        "wrongExplanation": "Why the others are wrong: \nB: An inbound security group rule is for traffic coming to the instance.  This is an outbound connection. \nC: The outbound request is to destination port 443, not to an ephemeral port.  The return traffic comes back to an ephemeral port on the instance, which would require an inbound NACL rule. \nD: The request is to https, which uses port 443, not http which uses port 80. "
    },
    {
        "number": 16,
        "title": "Automated Instance Reboot on High CPU (Based on #317)",
        "scenario": "A legacy application causes errors when CPU utilization on its EC2 instance exceeds 80%.  A short-term solution is needed to automatically reboot the instance when this happens.  The solution should have the LEAST operational overhead. ",
        "questionText": "Which solution meets these requirements with the LEAST operational overhead? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Write a script that runs as a cron job to monitor and reboot the instance. "
            },
            {
                "letter": "B",
                "text": "Add an Amazon CloudWatch alarm for CPU utilization and configure the alarm action to reboot the EC2 instances. "
            },
            {
                "letter": "C",
                "text": "Create an Amazon EventBridge rule to invoke a Lambda function to restart the instances. "
            },
            {
                "letter": "D",
                "text": "Add a CloudWatch alarm and configure an AWS Systems Manager Automation runbook to reboot the instances. "
            }
        ],
        "correctAnswers": ["B"],
        "explanation": "Correct Answer: B \nExplanation: This solution is the most direct and has the least operational overhead.  CloudWatch Alarms can be configured to take several built-in actions directly, one of which is to reboot an EC2 instance.  This requires no scripting, no Lambda functions, and no Systems Manager runbooks.  You simply create the alarm, set the metric (CPUUtilization > 80%), and select \"Reboot this instance \" from the dropdown list of actions.  It's a native, point-and-click (or single API call) solution. ",
        "wrongExplanation": "Why the others are wrong: \nA: Writing and maintaining a custom script and cron job on the instance itself introduces significant operational overhead compared to using a managed AWS service. \nC & D: While both of these solutions would work, they are more complex and have more operational overhead than the direct CloudWatch alarm action.  They involve configuring multiple services (EventBridge + Lambda, or CloudWatch + SSM) to accomplish something CloudWatch can do on its own.  Therefore, they do not have the least overhead. "
    },
    {
        "number": 17,
        "title": "Enforcing Standardized EC2 Configurations (Based on #311)",
        "scenario": "A company wants to ensure that all business units can only provision EC2 instances using pre-approved, standardized configurations. ",
        "questionText": "What should a SysOps administrator do to implement this requirement? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create an EC2 instance launch configuration. "
            },
            {
                "letter": "B",
                "text": "Develop an IAM policy that limits the business units to provision EC2 instances only. "
            },
            {
                "letter": "C",
                "text": "Publish a product and launch constraint role for EC2 instances by using AWS Service Catalog. Allow the business units to perform actions in AWS Service Catalog only. "
            },
            {
                "letter": "D",
                "text": "Share an AWS CloudFormation template with the business units. "
            }
        ],
        "correctAnswers": ["C"],
        "explanation": "Correct Answer: C \nExplanation: AWS Service Catalog is the service designed for creating and managing catalogs of IT services that are approved for use on AWS.  An administrator can define a \"product \" (e.g., a CloudFormation template for an approved EC2 instance configuration) and add it to a portfolio.  They can then grant business units access to this portfolio.  Users can then launch these pre-approved products without needing underlying permissions to the services themselves, thanks to launch constraint roles.  This provides governance, control, and standardization, perfectly matching the requirement. ",
        "wrongExplanation": "Why the others are wrong: \nA: Launch configurations are an older component of Auto Scaling groups and don't provide a broad governance mechanism for all instance launches. \nB & D: Simply providing an IAM policy or a CloudFormation template doesn't enforce the use of the approved configuration.  Users with EC2 permissions could still launch any instance type they want, or modify the shared template.  Service Catalog provides the necessary enforcement and governance layer. "
    },
    {
        "number": 18,
        "title": "Notification on EC2 Instance Launch (Based on #309)",
        "scenario": "A company's architecture team requires immediate email notification whenever a new EC2 instance is launched in the production account. ",
        "questionText": "What should a SysOps administrator do to meet this requirement? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Use a user data script to send an email. "
            },
            {
                "letter": "B",
                "text": "Create an Amazon SNS topic with an email subscription. Create an Amazon EventBridge rule that reacts to EC2 instance launches and targets the SNS topic. "
            },
            {
                "letter": "C",
                "text": "Use an Amazon SQS queue with an email subscription. "
            },
            {
                "letter": "D",
                "text": "Use AWS Systems Manager to publish events to an SNS topic, which is polled by a Lambda function. "
            }
        ],
        "correctAnswers": ["B"],
        "explanation": "Correct Answer: B \nExplanation: This is the standard, event-driven, serverless pattern for this type of notification.  Amazon EventBridge (formerly CloudWatch Events) can capture events happening in your AWS account, such as an EC2 instance changing to the \"running \" state.  You create a rule that matches this specific event.  The rule's target can be an Amazon SNS topic.  You create an SNS topic and subscribe the architecture team's email address to it.  When a new instance is launched, EventBridge catches the event and publishes a message to the SNS topic, which then sends an email to all subscribers.  This is efficient, scalable, and decoupled. ",
        "wrongExplanation": "Why the others are wrong: \nA: Relying on a user data script is unreliable.  It might fail, or someone might launch an instance without the script.  It's not a centralized or guaranteed solution. \nC: Amazon SQS (Simple Queue Service) is a message queue; it cannot send emails directly.  You would need another service (like Lambda) to poll the queue and then send the email, making it more complex than option B. \nD: This is an overly complex and convoluted architecture.  EventBridge is the primary service for reacting to AWS API events, and SNS can send emails directly.  There is no need for Systems Manager or a polling Lambda function. "
    },
    {
        "number": 19,
        "title": "Granular Cost and Usage Dashboards (Based on #307)",
        "scenario": "A company's finance team needs detailed dashboards to track AWS cost changes across the entire organization, with granularity down to the hour. ",
        "questionText": "What is the MOST operationally efficient way to meet these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Generate Amazon CloudWatch dashboards by using CloudWatch insights and AWS Cost Explorer data. "
            },
            {
                "letter": "B",
                "text": "Generate an AWS Cost and Usage Report (CUR). Store it in S3. Use Amazon Athena to query the data and Amazon QuickSight to build dashboards. "
            },
            {
                "letter": "C",
                "text": "Create a Lambda function that runs daily to pull data from Cost Explorer. "
            },
            {
                "letter": "D",
                "text": "Create an IAM user for the finance team with access to Cost Explorer. "
            }
        ],
        "correctAnswers": ["B"],
        "explanation": "Correct Answer: B \nExplanation: This describes the standard, recommended AWS architecture for detailed cost analysis, often called the Cloud Intelligence Dashboards framework.  The AWS Cost and Usage Report (CUR) is the most comprehensive source of cost and usage data and can be configured for hourly granularity.  By delivering the CUR to an S3 bucket, you create a data lake of your billing information.  Amazon Athena can then be used to run complex SQL queries directly on these files in S3.  Finally, Amazon QuickSight can connect to Athena as a data source to build powerful, interactive, and shareable dashboards for the finance team.  This entire pipeline is scalable and highly efficient once set up. ",
        "wrongExplanation": "Why the others are wrong: \nA: Cost Explorer data cannot be directly integrated into CloudWatch dashboards in this manner, and CloudWatch Logs Insights is for analyzing application/system logs, not billing data. \nC: Cost Explorer's API does not provide the same level of detail as the CUR, and running a daily Lambda function does not meet the hourly granularity requirement. \nD: Simply giving access to the Cost Explorer console is not sufficient.  Cost Explorer is great for high-level analysis, but it doesn't offer the deep, customizable query capabilities and dashboarding features of the Athena + QuickSight solution needed for detailed financial tracking. "
    },
    {
        "number": 20,
        "title": "High-Performance Temporary Cache (Based on #306)",
        "scenario": "A workload on an EC2 instance needs a temporary cache for frequently changing data.  The highest possible performance is required, and the data does not need to be retained if the instance restarts. ",
        "questionText": "Which storage option will provide the HIGHEST performance for the cache? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "General Purpose SSD (gp3) Amazon Elastic Block Store (Amazon EBS) volume"
            },
            {
                "letter": "B",
                "text": "Provisioned IOPS SSD (io2) Amazon Elastic Block Store (Amazon EBS) volume"
            },
            {
                "letter": "C",
                "text": "Throughput Optimized HDD (st1) Amazon Elastic Block Store (Amazon EBS) volume"
            },
            {
                "letter": "D",
                "text": "EC2 instance store"
            }
        ],
        "correctAnswers": ["D"],
        "explanation": "Correct Answer: D \nExplanation: EC2 instance store (also known as ephemeral storage) provides block-level storage that is physically attached to the host computer running the EC2 instance.  Because it is directly attached, it offers the lowest latency and highest I/O performance possible, making it ideal for high-performance caches, scratch disks, or buffers.  The key tradeoff, which is acceptable in this scenario, is that the data is non-persistent; it is lost if the instance is stopped, hibernated, or terminated. ",
        "wrongExplanation": "Why the others are wrong: \nA, B, C: These are all types of Amazon EBS volumes.  EBS provides persistent, network-attached storage.  While high-performance options like io2 exist, they will always have slightly higher latency than a physically attached instance store because the data has to travel over the AWS network to reach the volume.  Since the highest performance is the goal and persistence is not needed, instance store is the superior choice. "
    },
    {
        "number": 21,
        "title": "Troubleshooting CloudWatch Agent Permissions (Based on #305)",
        "scenario": "A SysOps administrator is troubleshooting an Amazon Linux 2 EC2 instance where the CloudWatch agent is running and correctly configured, but no logs are being published to CloudWatch Logs. ",
        "questionText": "What should the SysOps administrator do to resolve the issue? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Configure the AWS CLI and use a cron job to push logs. "
            },
            {
                "letter": "B",
                "text": "Inspect the retention period of the log group. "
            },
            {
                "letter": "C",
                "text": "Set up an Amazon Kinesis data stream. "
            },
            {
                "letter": "D",
                "text": "Ensure that the IAM role that is attached to the EC2 instance has the necessary permissions for CloudWatch Logs. "
            }
        ],
        "correctAnswers": ["D"],
        "explanation": "Correct Answer: D \nExplanation: For the CloudWatch agent on an EC2 instance to send logs to the CloudWatch Logs service, it needs permission to make API calls to that service.  These permissions are granted via an IAM role attached to the instance.  If the agent is running and configured correctly, the most common cause of failure is a missing or incorrect IAM role.  The role must have a policy that allows actions such as logs:CreateLogGroup, logs:CreateLogStream, logs:PutLogEvents, and logs: DescribeLogStreams. ",
        "wrongExplanation": "Why the others are wrong: \nA: This is a cumbersome workaround that bypasses the agent.  The goal is to fix the agent, not replace its functionality with a custom script. \nB: The log group retention period determines how long logs are kept after they arrive.  It has no effect on whether the agent can send the logs in the first place.  If no logs are arriving, a log group might not even exist yet. \nC: Kinesis is a service for streaming data at scale.  It's not required for the basic functionality of the CloudWatch agent and would add unnecessary complexity.  The agent is designed to send logs directly to CloudWatch Logs. "
    },
    {
        "number": 22,
        "title": "",
        "scenario": "A company hosts a Windows-based file server on a fleet of Amazon EC2 instances spread across multiple Availability Zones.  The application servers are currently unable to access files simultaneously from this fleet. ",
        "questionText": "Which solution will allow simultaneous file access from multiple application servers in the MOST operationally efficient way? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create an Amazon Elastic File System (Amazon EFS) Multi-AZ file system. Copy the files to the EFS file system. Connect the EFS file system to mount points on the application servers. "
            },
            {
                "letter": "B",
                "text": "Create an Amazon FSx for Windows File Server Multi-AZ file system. Copy the files to the Amazon FSx file system. Adjust the connections from the application servers to use the share that the Amazon FSx file system exposes. "
            },
            {
                "letter": "C",
                "text": "Create an Amazon Elastic Block Store (Amazon EBS) volume that has EBS Multi-Attach enabled. Create an Auto Scaling group for the Windows file server. Use a script in the file server's user data to attach the Shared FileAccess tag to the EBS volume during launch. "
            },
            {
                "letter": "D",
                "text": "Create two Amazon FSx for Windows File Server file systems. Configure Distributed File System (DFS) replication between the file systems. Copy the files to the Amazon FSx file systems. Adjust the connections from the application servers to use the shares that the Amazon FSx file systems expose. "
            }
        ],
        "correctAnswers": ["B"],
        "explanation": "Correct Answer: B \nExplanation:\nThis question requires a shared file storage solution that is compatible with Windows and highly available across multiple Availability Zones.  Why B is correct: Amazon FSx for Windows File Server is a fully managed service that provides shared file storage built on Windows Server.  It natively supports the SMB protocol, Windows ACLs, and Multi-AZ deployments.  This makes it the perfect fit for providing highly available, shared file access to Windows-based EC2 instances without requiring complex manual configuration. ",
        "wrongExplanation": "Why A is incorrect: Amazon EFS is designed for Linux-based workloads and uses the NFS protocol.  While it can be accessed from Windows instances, it's not the native or most efficient solution for a Windows environment. \nWhy C is incorrect: EBS Multi-Attach allows an EBS volume to be attached to multiple Nitro-based instances, but only within the same Availability Zone.  This does not meet the requirement of being accessible across multiple AZs. \nWhy D is incorrect: While using two FSx file systems with DFS replication would work, it is not the most operationally efficient solution.  A single Multi-AZ FSx file system handles the replication and failover automatically, reducing management overhead compared to setting up and managing DFS replication manually. "
    },
    {
        "number": 23,
        "title": "",
        "scenario": "A company uses AWS Organizations to manage a multi-account environment.  They need to automate the creation of daily incremental backups for any Amazon EBS volume tagged with Lifecycle: Production.  A key requirement is to prevent users from deleting these production snapshots using their standard EC2 permissions. ",
        "questionText": "What should a SysOps administrator do to meet these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create a daily snapshot of all EBS volumes by using Amazon Data Lifecycle Manager. Specify Lifecycle as the tag key. Specify Production as the tag value. "
            },
            {
                "letter": "B",
                "text": "Associate a service control policy (SCP) with the account to deny users the ability to delete EBS snapshots. Create an Amazon EventBridge rule with a 24-hour cron schedule. Configure EBS Create Snapshot as the target. Target all EBS volumes with the specified tags. "
            },
            {
                "letter": "C",
                "text": "Create a daily snapshot of all EBS volumes by using AWS Backup. Specify Lifecycle as the tag key. Specify Production as the tag value. "
            },
            {
                "letter": "D",
                "text": "Create a daily Amazon Machine Image (AMI) of every production EC2 instance within the AWS account by using Amazon Data Lifecycle Manager. "
            }
        ],
        "correctAnswers": ["C"],
        "explanation": "Correct Answer: C \nExplanation:\nThe core requirements are automated, tag-based, incremental backups and protection against deletion.  Why C is correct: AWS Backup is a centralized backup service that simplifies the management of backups across AWS services.  It can create tag-based backup plans to automatically take daily incremental snapshots.  Crucially, AWS Backup has a feature called Backup Vault Lock, which can enforce write-once, read-many (WORM) policies.  This prevents anyone, including administrators, from deleting the backups before the retention period expires, directly meeting the deletion prevention requirement. ",
        "wrongExplanation": "Why A is incorrect: Amazon Data Lifecycle Manager (DLM) can automate snapshot creation based on tags, but it does not have a built-in, robust feature like Vault Lock to prevent users with ec2:DeleteSnapshot permissions from deleting the snapshots it creates. \nWhy B is incorrect: This solution is overly complex and has flaws.  While an SCP can deny ec2:DeleteSnapshot, it would be a blanket denial and could interfere with legitimate operations.  Using EventBridge to trigger snapshots is less efficient than using a dedicated backup service.  AWS Backup is the more integrated and appropriate tool. \nWhy D is incorrect: The requirement is to back up EBS volumes, not entire EC2 instances.  Creating an AMI is unnecessary and would back up more data than required. "
    },
    {
        "number": 24,
        "title": "",
        "scenario": "An application runs on hundreds of Amazon EC2 instances distributed across three Availability Zones.  This application needs to make calls to a third-party API over the public internet.  The third-party provider requires a static list of IP addresses to add to their allow list. ",
        "questionText": "Which solution will meet these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Add a NAT gateway in the public subnet of each Availability Zone. Make the NAT gateway the default route of all private subnets in those Availability Zones. "
            },
            {
                "letter": "B",
                "text": "Allocate one Elastic IP address in each Availability Zone. Associate the Elastic IP address with all the instances in the Availability Zone. "
            },
            {
                "letter": "C",
                "text": "Place the instances behind a Network Load Balancer (NLB). Send the traffic to the internet through the private IP address of the NLB. "
            },
            {
                "letter": "D",
                "text": "Update the main route table to send the traffic to the internet through an Elastic IP address that is assigned to each instance. "
            }
        ],
        "correctAnswers": ["A"],
        "explanation": "Correct Answer: A \nExplanation:\nThe goal is to provide a small, fixed number of public IP addresses for a large, dynamic fleet of EC2 instances making outbound connections.  Why A is correct: This is the classic and recommended architecture for this scenario.  By placing a NAT Gateway in each Availability Zone's public subnet and routing outbound traffic from the private subnets through it, all instances in that AZ will appear to originate from the single, static Elastic IP address associated with that NAT Gateway.  This provides a stable, highly available solution with only three IP addresses to give to the third party. ",
        "wrongExplanation": "Why B is incorrect: An Elastic IP address can only be associated with one EC2 instance at a time.  It's not possible to associate a single EIP with \"all the instances \" in an AZ. \nWhy C is incorrect: Load balancers (both NLB and ALB) are designed for managing inbound traffic to your instances, not for routing outbound traffic from them. \nWhy D is incorrect: Assigning an Elastic IP address to each of the \"hundreds \" of instances is not operationally efficient, would be costly, and would result in a very long list of IP addresses to provide to the third party, which defeats the purpose of simplifying the allow list. "
    },
    {
        "number": 25,
        "title": "",
        "scenario": "A SysOps administrator is setting up an Amazon S3 bucket to host a static web application.  The files have been copied to the bucket.  A strict company policy dictates that all S3 buckets must remain private and not be publicly accessible. ",
        "questionText": "What should the SysOps administrator do to meet these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create an Amazon CloudFront distribution. Configure the S3 bucket as an origin with an origin access identity (OAI). Give the OAI the s3:GetObject permission in the S3 bucket policy. "
            },
            {
                "letter": "B",
                "text": "Configure static website hosting in the S3 bucket. Use Amazon Route 53 to create a DNS CNAME to point to the S3 website endpoint. "
            },
            {
                "letter": "C",
                "text": "Create an Application Load Balancer (ALB). Change the protocol to HTTPS in the ALB listener configuration. Forward the traffic to the S3 bucket. "
            },
            {
                "letter": "D",
                "text": "Create an accelerator in AWS Global Accelerator. Set up a listener configuration for port 443. Set the endpoint type to forward the traffic to the S3 bucket. "
            }
        ],
        "correctAnswers": ["A"],
        "explanation": "Correct Answer: A \nExplanation:\nThe challenge is to serve content to the public from an S3 bucket that itself must remain private.  Why A is correct: This is the standard and most secure method for this use case.  Amazon CloudFront can act as the public-facing entry point.  An Origin Access Identity (OAI) is a special CloudFront user that you can grant permissions to access your private S3 bucket.  You can then configure the S3 bucket policy to only allow access from this OAI, keeping the bucket private from all other public access.  Users access the content via CloudFront, which securely fetches it from the private bucket. ",
        "wrongExplanation": "Why B is incorrect: Configuring static website hosting on an S3 bucket requires the bucket and its objects to be made public, which directly violates the company policy. \nWhy C and D are incorrect: While an ALB or Global Accelerator can route traffic, they are not the primary or most direct services for serving content from S3 while keeping the bucket private.  CloudFront with OAI is the purpose-built solution for this exact scenario. "
    },
    {
        "number": 26,
        "title": "",
        "scenario": "An application running on an Amazon EC2 instance needs to interact with Amazon SQS queues.  Specifically, it must be able to read, write, and delete messages. ",
        "questionText": "Which solution will meet these requirements in the MOST secure manner? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create an IAM user with an IAM policy that allows the sqs:SendMessage, sqs:ReceiveMessage, and sqs:Delete Message permission. Embed the IAM user's credentials in the application's configuration. "
            },
            {
                "letter": "B",
                "text": "Create an IAM user with an IAM policy that allows the sqs:SendMessage, sqs:ReceiveMessage, and sqs:Delete Message permission. Export the IAM user's access key and secret access key as environment variables on the EC2 instance. "
            },
            {
                "letter": "C",
                "text": "Create and associate an IAM role that allows EC2 instances to call AWS services. Attach an IAM policy to the role that allows sqs:* permissions to the appropriate queues. "
            },
            {
                "letter": "D",
                "text": "Create and associate an IAM role that allows EC2 instances to call AWS services. Attach an IAM policy to the role that allows the sqs: SendMessage, sqs: ReceiveMessage, and sqs:Delete Message permission to the appropriate queues. "
            }
        ],
        "correctAnswers": ["D"],
        "explanation": "Correct Answer: D \nExplanation:\nThis question tests the best practices for granting permissions to AWS resources, emphasizing security.  Why D is correct: This option follows two key security best practices.  First, it uses an IAM Role associated with the EC2 instance.  This is superior to using IAM user credentials because the credentials are automatically rotated and managed by AWS, eliminating the risk of long-lived keys being exposed.  Second, it adheres to the Principle of Least Privilege by granting only the specific permissions required (SendMessage, ReceiveMessage, DeleteMessage) rather than a broad wildcard. ",
        "wrongExplanation": "Why A and B are incorrect: Both of these options involve using long-lived IAM user credentials (access key and secret key) and storing them on the instance.  This is a significant security risk.  If the instance is ever compromised, the attacker gains access to these keys.  IAM roles are the recommended alternative. \nWhy C is incorrect: While using an IAM role is correct, this option violates the principle of least privilege by using a wildcard (sqs:*).  This grants the application far more permissions than it needs (e.g., permissions to create or delete queues), increasing the potential impact if the application's credentials are ever compromised. "
    },
    {
        "number": 27,
        "title": "",
        "scenario": "A SysOps administrator has configured an Amazon CloudFront distribution with an Application Load Balancer (ALB) as the origin to reduce load on the web servers.  After a week, monitoring shows that requests are still being served directly by the ALB, and there's no change in the web server load. ",
        "questionText": "What are possible causes for this problem? (CHOOSE TWO.) ",
        "isMultiChoice": true,
        "options": [
            {
                "letter": "A",
                "text": "CloudFront does not have the ALB configured as the origin access identity. "
            },
            {
                "letter": "B",
                "text": "The DNS is still pointing to the ALB instead of the CloudFront distribution. "
            },
            {
                "letter": "C",
                "text": "The ALB security group is not permitting inbound traffic from CloudFront. "
            },
            {
                "letter": "D",
                "text": "The default, minimum, and maximum Time to Live (TTL) are set to O seconds on the CloudFront distribution. "
            },
            {
                "letter": "E",
                "text": "The target groups associated with the ALB are configured for sticky sessions. "
            }
        ],
        "correctAnswers": ["B", "D"],
        "explanation": "Correct Answers: B and D \nExplanation:\nThe problem is that CloudFront is not caching or serving the traffic as expected.  Why B is correct: If the public DNS record (e.g., www.example.com) still points directly to the ALB's DNS name, users will bypass CloudFront entirely.  For CloudFront to serve traffic, the public DNS record must be updated to point to the CloudFront distribution's domain name (e.g., d12345.cloudfront.net).  Why D is correct: The Time to Live (TTL) setting in CloudFront's cache behavior tells CloudFront how long to cache an object at the edge location before checking with the origin (the ALB) again.  If the TTL is set to O, CloudFront will forward every single request to the ALB to check for an updated version.  This effectively disables caching and would result in no load reduction on the origin servers. ",
        "wrongExplanation": "Why A is incorrect: Origin Access Identity (OAI) is used to restrict access to S3 bucket origins, not ALB origins.  For an ALB, you would typically use custom headers and security group rules to restrict access. \nWhy C is incorrect: If the ALB security group blocked traffic from CloudFront, users would receive errors (e.g., 502 Bad Gateway) from CloudFront.  The problem described is that traffic is still being served, just not from the cache. \nWhy E is incorrect: Sticky sessions on the ALB ensure that a user is consistently routed to the same backend EC2 instance.  This would not prevent CloudFront from caching content. "
    },
    {
        "number": 28,
        "title": "",
        "scenario": "An Amazon RDS for PostgreSQL DB cluster has automated backups enabled with a 7-day retention period.  A SysOps administrator needs to create a new, separate RDS DB cluster using data that is no more than 24 hours old from the original cluster. ",
        "questionText": "Which solutions will meet these requirements with the LEAST operational overhead? (CHOOSE TWO.) ",
        "isMultiChoice": true,
        "options": [
            {
                "letter": "A",
                "text": "Identify the most recent automated snapshot. Restore the snapshot to a new RDS DB cluster. "
            },
            {
                "letter": "B",
                "text": "Back up the database to Amazon S3 by using native database backup tools. Create a new RDS DB cluster and restore the data to the new RDS DB cluster. "
            },
            {
                "letter": "C",
                "text": "Create a read replica instance in the original RDS DB cluster. Promote the read replica to a standalone DB cluster. "
            },
            {
                "letter": "D",
                "text": "Create a new RDS DB cluster. Use AWS Database Migration Service (AWS DMS) to migrate data from the current RDS DB cluster to the newly created RDS DB cluster. "
            },
            {
                "letter": "E",
                "text": "Use the pg_dump utility to export data from the original RDS DB cluster to an Amazon EC2 instance. Create a new RDS DB cluster. Use the pg_restore utility to import the data from the EC2 instance to the new RDS DB cluster. "
            }
        ],
        "correctAnswers": ["A", "C"],
        "explanation": "Correct Answers: A and C \nExplanation:\nThe goal is to create a new, independent cluster from recent data with minimal effort.  Why A is correct: RDS automated backups include daily snapshots and transaction logs.  This allows for point-in-time recovery.  Restoring from the most recent automated snapshot is a simple, built-in RDS feature that can be done with a few clicks or a single API call, representing very low operational overhead.  Why C is correct: Creating a read replica provides an asynchronously updated, read-only copy of the database.  This replica can be \"promoted \" to become a new, independent, writeable DB cluster at any time.  This is also a standard, low-overhead RDS operation.  The data on the replica is typically only seconds or minutes behind the primary, easily meeting the \"less than 24 hours old \" requirement. ",
        "wrongExplanation": "Why B and E are incorrect: Using native database tools like pg_dump involves manual steps: connecting to the database, running the backup, managing the backup file, connecting to the new database, and running the restore.  This is significantly more operational overhead than using the built-in RDS features. \nWhy D is incorrect: AWS DMS is a powerful service designed for migrating databases, often between different database engines or from on-premises to AWS.  Using it to simply clone an existing RDS cluster is overkill and involves more setup and configuration (e.g., creating replication instances, defining tasks) than restoring a snapshot or promoting a replica. "
    },
    {
        "number": 29,
        "title": "",
        "scenario": "A user, authenticated via Active Directory federation, attempts to deploy an AWS CloudFormation template that creates an Amazon S3 bucket.  The stack creation fails. ",
        "questionText": "Which factors could cause this failure? (CHOOSE TWO.) ",
        "isMultiChoice": true,
        "options": [
            {
                "letter": "A",
                "text": "The user's IAM policy does not allow the cloudformation:CreateStack action. "
            },
            {
                "letter": "B",
                "text": "The user's IAM policy does not allow the cloudformation:CreateStackSet action. "
            },
            {
                "letter": "C",
                "text": "The user's IAM policy does not allow the s3:CreateBucket action. "
            },
            {
                "letter": "D",
                "text": "The user's IAM policy explicitly denies the s3: ListBucket action. "
            },
            {
                "letter": "E",
                "text": "The user's IAM policy explicitly denies the s3: PutObject action. "
            }
        ],
        "correctAnswers": ["A", "C"],
        "explanation": "Correct Answers: A and C \nExplanation:\nWhen a user deploys a CloudFormation stack, two sets of permissions are involved: the user's permission to interact with CloudFormation, and CloudFormation's permission to create the resources in the template.  Why A is correct: To initiate the stack creation process, the user themselves must have the cloudformation:CreateStack permission.  If this is missing, the request to create the stack will be denied immediately.  Why C is correct: CloudFormation acts on behalf of the user who initiated the stack creation (unless a service role is specified).  Therefore, the user's IAM credentials must also include the permissions needed to create the resources defined in the template.  In this case, to create an S3 bucket, the user needs the s3:CreateBucket permission.  If this is missing, CloudFormation will fail when it attempts to provision the bucket. ",
        "wrongExplanation": "Why B is incorrect: CreateStackSet is for deploying stacks across multiple accounts and regions.  The scenario describes deploying a single stack, which uses the CreateStack action. \nWhy D and E are incorrect: The s3:ListBucket and s3:PutObject actions are for interacting with an existing bucket (listing its contents or adding objects).  They are not required for the initial creation of the bucket itself.  The stack would fail specifically at the CreateBucket step. "
    },
    {
        "number": 30,
        "title": "",
        "scenario": "A company is building a financial application that stores sensitive data in Amazon S3.  The data must be encrypted at rest.  The company does not want to manage its own encryption keys but requires an audit trail of when and by whom the keys are used. ",
        "questionText": "Which solution will meet these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Use client-side encryption with client-provided keys. Upload the encrypted user data to Amazon S3. "
            },
            {
                "letter": "B",
                "text": "Use server-side encryption with S3 managed encryption keys (SSE-S3) to encrypt the user data on Amazon S3. "
            },
            {
                "letter": "C",
                "text": "Use server-side encryption with customer-provided encryption keys (SSE-C) to encrypt the user data on Amazon S3. "
            },
            {
                "letter": "D",
                "text": "Use server-side encryption with AWS KMS managed encryption keys (SSE-KMS) to encrypt the user data on Amazon S3. "
            }
        ],
        "correctAnswers": ["D"],
        "explanation": "Correct Answer: D \nExplanation:\nThe key requirements are AWS-managed keys and a detailed audit trail of key usage.  Why D is correct: Server-Side Encryption with AWS Key Management Service (SSE-KMS) meets both requirements perfectly.  AWS manages the lifecycle of the keys (so the company doesn't have to), but the company retains control over the key's policy.  Crucially, every time this KMS key is used to encrypt or decrypt an S3 object, the action is logged in AWS CloudTrail.  This provides the detailed audit trail of key usage (who, what, when) that the company requires. ",
        "wrongExplanation": "Why A and C are incorrect: Both of these options involve the company providing and managing their own encryption keys, which violates the requirement of not wanting to manage their own keys. \nWhy B is incorrect: Server-Side Encryption with S3-Managed Keys (SSE-S3) is the simplest form of encryption.  AWS fully manages the keys and the encryption process.  However, it does not provide a separate, detailed CloudTrail audit log for the usage of the data keys.  The control and auditability are much lower than with SSE-KMS. "
    },
    {
        "number": 31,
        "title": "",
        "scenario": "A company uses AWS Organizations and needs to automate the provisioning of the same set of resources from the management account to multiple member accounts. ",
        "questionText": "Which solution will meet this requirement? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create an AWS CloudFormation change set. Deploy the change set to all member accounts. "
            },
            {
                "letter": "B",
                "text": "Create an AWS CloudFormation nested stack. Deploy the nested stack to all member accounts. "
            },
            {
                "letter": "C",
                "text": "Create an AWS CloudFormation stack set. Deploy the stack set to all member accounts. "
            },
            {
                "letter": "D",
                "text": "Create an AWS Serverless Application Model (AWS SAM) template. Deploy the template to all member accounts. "
            }
        ],
        "correctAnswers": ["C"],
        "explanation": "Correct Answer: C \nExplanation:\nThe requirement is to deploy a single CloudFormation template across multiple AWS accounts within an Organization.  Why C is correct: AWS CloudFormation StackSets are designed for this exact purpose.  A StackSet allows you to create, update, or delete stacks across multiple accounts and regions with a single operation.  You create the StackSet in the management account and can target specific Organizational Units (OUs) or a list of member accounts. ",
        "wrongExplanation": "Why A is incorrect: A change set is a preview of the changes a CloudFormation template will make to a single stack.  It does not deploy anything, let alone across multiple accounts. \nWhy B is incorrect: A nested stack is a stack that is created as part of another stack.  It's a way to reuse common template components within a single parent stack, not for deploying across accounts. \nWhy D is incorrect: AWS SAM is an extension of CloudFormation specifically for defining serverless applications.  While it uses CloudFormation, it doesn't inherently provide the multi-account deployment capability that StackSets do. "
    },
    {
        "number": 32,
        "title": "",
        "scenario": "A SysOps administrator has created a custom Amazon Machine Image (AMI) in the eu-west-2 Region.  They need to use this same AMI to launch EC2 instances in two other Regions: us-east-1 and us-east-2. ",
        "questionText": "What must the SysOps administrator do to use the custom AMI in the additional Regions? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Copy the AMI to the additional Regions. "
            },
            {
                "letter": "B",
                "text": "Make the AMI public in the Community AMIs section of the AWS Management Console. "
            },
            {
                "letter": "C",
                "text": "Share the AMI to the additional Regions. Assign the required access permissions. "
            },
            {
                "letter": "D",
                "text": "Copy the AMI to a new Amazon S3 bucket. Assign access permissions to the AMI for the additional Regions. "
            }
        ],
        "correctAnswers": ["A"],
        "explanation": "Correct Answer: A \nExplanation:\nThis question tests the fundamental nature of AMIs as a regional resource.  Why A is correct: AMIs are a regional resource.  An AMI created in one AWS Region (e.g., eu-west-2) can only be used to launch instances in that same Region.  To use it in another Region, you must explicitly copy the AMI to the target Region.  This creates a new, independent AMI in the destination Region with its own unique AMI ID. ",
        "wrongExplanation": "Why B is incorrect: Making an AMI public would allow other AWS accounts to use it, but it would still only be available within the Region where it was created. \nWhy C is incorrect: Sharing an AMI allows other AWS accounts to use your private AMI, but again, this sharing is confined to the Region where the AMI exists.  You cannot \"share \" an AMI to another Region. \nWhy D is incorrect: While the underlying snapshot of an AMI is stored in S3, this is an implementation detail managed by AWS.  You cannot simply copy the AMI to an S3 bucket and use it in another region.  The correct procedure is the Copy AMI action. "
    },
    {
        "number": 33,
        "title": "",
        "scenario": "A SysOps administrator is setting up a simple, public-facing website on a single EC2 instance.  They have performed the following steps: \n1. Created the EC2 instance in a public subnet. \n2. Assigned an Elastic IP address to it. \n3. Created and applied a new security group allowing inbound HTTP (port 80) from 0.0.0.0/0. \n4. Created a new network ACL and applied it to the subnet, allowing inbound HTTP (port 80) from 0.0.0.0/0. \nDespite these steps, the website cannot be reached from the internet. ",
        "questionText": "What is the cause of this issue? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "The SysOps administrator did not create an outbound rule that allows ephemeral port return traffic in the new network ACL. "
            },
            {
                "letter": "B",
                "text": "The SysOps administrator did not create an outbound rule in the security group that allows HTTP traffic from port 80. "
            },
            {
                "letter": "C",
                "text": "The Elastic IP address assigned to the EC2 instance has changed. "
            },
            {
                "letter": "D",
                "text": "There is an additional network ACL associated with the subnet that includes a rule that denies inbound HTTP traffic from port 80. "
            }
        ],
        "correctAnswers": ["A"],
        "explanation": "Correct Answer: A \nExplanation:\nThis question hinges on the difference between stateful security groups and stateless network ACLS.  Why A is correct: Network ACLS (NACLs) are stateless.  This means you must explicitly define rules for both inbound and outbound traffic.  When a user on the internet sends a request to your server on port 80, the server needs to send the response back.  This response traffic will originate from the server (on port 80) and be destined for the user's computer on a random, high-numbered port (an ephemeral port, typically in the range 1024-65535).  The new, custom NACL has an inbound allow rule, but it lacks the corresponding outbound rule to allow this return traffic to leave the subnet.  The default NACL allows all traffic in both directions, but a new custom NACL denies all traffic by default until allow rules are added. ",
        "wrongExplanation": "Why B is incorrect: Security Groups are stateful.  If you allow inbound traffic on a port, the corresponding return traffic is automatically allowed, regardless of the outbound rules.  Therefore, a missing outbound rule in the security group is not the problem. \nWhy C is incorrect: Elastic IP addresses are static by definition and do not change unless you explicitly disassociate or release them. \nWhy D is incorrect: A subnet can only have one NACL associated with it at a time.  Applying a new NACL replaces the previous one. "
    },
    {
        "number": 34,
        "title": "",
        "scenario": "A SysOps administrator is designing a disaster recovery (DR) plan for a critical application.  The application runs on EC2 instances in an Auto Scaling group behind an ALB and uses an Amazon Aurora PostgreSQL database.  The RTO (Recovery Time Objective) and RPO (Recovery Point Objective) are both 15 minutes. ",
        "questionText": "Which combination of steps should the SysOps administrator take to meet these requirements MOST cost-effectively? (CHOOSE TWO.) ",
        "isMultiChoice": true,
        "options": [
            {
                "letter": "A",
                "text": "Configure Aurora backups to be exported to the DR Region. "
            },
            {
                "letter": "B",
                "text": "Configure the Aurora cluster to replicate data to the DR Region by using the Aurora global database option. "
            },
            {
                "letter": "C",
                "text": "Configure the DR Region with an ALB and an Auto Scaling group. Use the same configuration as in the primary Region. "
            },
            {
                "letter": "D",
                "text": "Configure the DR Region with an ALB and an Auto Scaling group. Set the Auto Scaling group's minimum capacity, maximum capacity, and desired capacity to 1. "
            },
            {
                "letter": "E",
                "text": "Manually launch a new ALB and a new Auto Scaling group by using AWS CloudFormation during a failover activity. "
            }
        ],
        "correctAnswers": ["B", "D"],
        "explanation": "Correct Answers: B and D \nExplanation:\nThe goal is a cost-effective DR strategy with a low RTO/RPO.  This points to a \"Warm Standby \" approach.  Why B is correct: An Aurora Global Database provides fast cross-region replication with a typical lag of less than one second.  This easily meets the 15-minute RPO (data loss tolerance).  In a DR event, the secondary cluster can be promoted to a full read/write master in minutes, helping to meet the 15-minute RTO.  This is far more efficient for low RPO/RTO than restoring from backups.  Why D is correct: This describes a \"Warm Standby \" for the application tier.  You have a scaled-down version of your infrastructure running in the DR region (a single instance).  This is more cost-effective than running a full-scale copy (Option C).  During a failover, you can redirect traffic to this small environment and then quickly scale up the Auto Scaling group to handle the full production load.  This keeps DR costs low while still allowing you to meet the 15-minute RTO. ",
        "wrongExplanation": "Why A is incorrect: Restoring a database from a snapshot backup in another region would likely take longer than 15 minutes and would not meet the 15-minute RPO, as the last snapshot could be hours old. \nWhy C is incorrect: Running a full-scale copy of the production environment in the DR region (a \"Hot Standby \" or \"Multi-Site Active/Active \" approach) would be very expensive and is more than what is required to meet a 15-minute RTO.  Option D is more cost-effective. \nWhy E is incorrect: Manually launching the entire infrastructure from scratch during a disaster would take far too long and would not meet the 15-minute RTO. "
    },
    {
        "number": 35,
        "title": "",
        "scenario": "A company's VPC, located in a single Availability Zone, is connected to their on-premises data center via an AWS Site-to-Site VPN.  Communication is working correctly.  A SysOps administrator then creates new subnets in a new Availability Zone and deploys resources there.  These new resources cannot communicate with the on-premises environment. ",
        "questionText": "Which steps should the SysOps administrator take to resolve the issue? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Add a route to the route tables of the new subnets that send on-premises traffic to the virtual private gateway. "
            },
            {
                "letter": "B",
                "text": "Create a ticket with AWS Support to request adding Availability Zones to the Site-to-Site VPN route configuration. "
            },
            {
                "letter": "C",
                "text": "Establish a new Site-to-Site VPN connection between a virtual private gateway attached to the new Availability Zone and the on-premises data center. "
            },
            {
                "letter": "D",
                "text": "Replace the Site-to-Site VPN connection with an AWS Direct Connect connection. "
            }
        ],
        "correctAnswers": ["A"],
        "explanation": "Correct Answer: A \nExplanation:\nThe problem is a networking configuration issue within the VPC.  Why A is correct: When you create new subnets, they are associated with a route table (either the main route table or a new custom one).  For instances in these new subnets to communicate with the on-premises network, their subnet route table must have a rule that directs traffic destined for the on-premises network CIDR range to the Virtual Private Gateway (VGW).  The original subnets had this route, but the new ones do not.  Adding this route will fix the communication path. ",
        "wrongExplanation": "Why B is incorrect: The Site-to-Site VPN connection is to the VPC as a whole, via the VGW.  It is not tied to a specific Availability Zone.  This is a configuration issue, not something AWS Support needs to change. \nWhy C is incorrect: A single VPN connection to the VGW is sufficient for the entire VPC.  You do not need separate VPN connections for each AZ. \nWhy D is incorrect: While Direct Connect is another way to establish hybrid connectivity, it is not necessary to solve this simple routing problem.  The existing VPN connection is sufficient. "
    },
    {
        "number": 36,
        "title": "",
        "scenario": "A company has enabled server access logging for all its existing Amazon S3 buckets.  They want to implement a solution that continuously monitors the logging settings for both new and existing S3 buckets and automatically remediates any bucket that does not have logging turned on. ",
        "questionText": "What should a SysOps administrator do to meet these requirements in the MOST operationally efficient way? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Track the logging information by using AWS CloudTrail. Launch an AWS Lambda function for remediation. "
            },
            {
                "letter": "B",
                "text": "Configure automatic remediation in AWS Config by using the s3-bucket-logging-enabled rule. "
            },
            {
                "letter": "C",
                "text": "Configure AWS Trusted Advisor to monitor the logging configuration and to turn on access logging if necessary. "
            },
            {
                "letter": "D",
                "text": "Track the logging information by using Amazon CloudWatch metrics. Launch an AWS Lambda function for remediation. "
            }
        ],
        "correctAnswers": ["B"],
        "explanation": "Correct Answer: B \nExplanation:\nThe requirement is for automated compliance checking and remediation.  Why B is correct: AWS Config is a service designed specifically for assessing, auditing, and evaluating the configurations of your AWS resources.  It has a managed rule called s3-bucket-logging-enabled that checks if S3 buckets have logging enabled.  AWS Config also supports automatic remediation, where you can associate an action (like running an SSM Automation document or a Lambda function) to automatically fix a non-compliant resource.  This is the most direct, integrated, and operationally efficient solution. ",
        "wrongExplanation": "Why A and D are incorrect: While you could build a custom solution using CloudTrail or CloudWatch events to trigger a Lambda function for remediation, this is reinventing the wheel.  AWS Config provides this functionality out of the box and is the more efficient and standard approach for configuration compliance. \nWhy C is incorrect: AWS Trusted Advisor provides recommendations to help you follow AWS best practices, but it does not offer automated remediation capabilities.  It can identify the problem but cannot fix it automatically. "
    },
    {
        "number": 37,
        "title": "",
        "scenario": "A SysOps administrator is configuring an Auto Scaling group for an application.  The fleet of EC2 instances must always have 50% CPU available to handle traffic bursts.  The load is known to increase significantly every day between 09:00 and 17:00. ",
        "questionText": "How should the SysOps administrator configure the scaling of the EC2 instances to meet these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create a target tracking scaling policy that runs when the CPU utilization is higher than 90%. "
            },
            {
                "letter": "B",
                "text": "Create a target tracking scaling policy that runs when the CPU utilization is higher than 50%. Create a scheduled scaling policy that ensures that the fleet is available at 09:00. Create a second scheduled scaling policy that scales in the fleet at 17:00. "
            },
            {
                "letter": "C",
                "text": "Set the Auto Scaling group to start with 2 instances by setting the desired instances, maximum instances, and minimum instances to 2. Create a scheduled scaling policy that ensures that the fleet is available at 09:00. "
            },
            {
                "letter": "D",
                "text": "Create a scheduled scaling policy that ensures that the fleet is available at 09:00. Create a second scheduled scaling policy that scales in the fleet at 17:00. "
            }
        ],
        "correctAnswers": ["B"],
        "explanation": "Correct Answer: B \nExplanation:\nThis scenario requires a combination of proactive and reactive scaling.  Why B is correct: This solution addresses both requirements.  The target tracking scaling policy with a target of 50% CPU utilization is the reactive part.  It will automatically add or remove instances to keep the average CPU utilization at or near 50%, ensuring there's always headroom for bursts.  The scheduled scaling policies are the proactive part.  They pre-emptively increase the number of instances at 09:00 just before the predictable load increase, and scale them back down at 17:00 when the load subsides.  This combination is the most effective and efficient way to handle both predictable and unpredictable traffic patterns. ",
        "wrongExplanation": "Why A is incorrect: A target of 90% CPU utilization leaves only 10% headroom, which violates the 50% availability requirement. \nWhy C is incorrect: Simply setting the instance counts to 2 and using a scheduled policy doesn't include a dynamic scaling policy to handle unexpected bursts. \nWhy D is incorrect: This option only includes proactive scheduled scaling.  It does not have a reactive policy (like target tracking) to handle traffic bursts that might occur outside the scheduled window or that exceed the capacity set by the schedule. "
    },
    {
        "number": 38,
        "title": "",
        "scenario": "A company has moved its servers to Amazon EC2.  They want to use Amazon CloudWatch to monitor instance-level metrics like memory utilization and available disk space. ",
        "questionText": "What should a SysOps administrator do to meet these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Configure CloudWatch from the AWS Management Console for all the instances that require monitoring by CloudWatch. AWS automatically installs and configures the agents for the specified instances. "
            },
            {
                "letter": "B",
                "text": "Install and configure the CloudWatch agent on all the instances. Attach an IAM role to allow the instances to write logs to CloudWatch. "
            },
            {
                "letter": "C",
                "text": "Install and configure the CloudWatch agent on all the instances. Attach an IAM user to allow the instances to write logs to CloudWatch. "
            },
            {
                "letter": "D",
                "text": "Install and configure the CloudWatch agent on all the instances. Attach the necessary security groups to allow the instances to write logs to CloudWatch. "
            }
        ],
        "correctAnswers": ["B"],
        "explanation": "Correct Answer: B \nExplanation:\nThis question is about collecting custom metrics for CloudWatch.  Why B is correct: By default, CloudWatch only collects basic metrics from the hypervisor level (like CPU Utilization, Network In/Out, Disk Read/Write Ops).  It has no visibility inside the guest operating system.  To collect metrics like memory utilization, disk space, or other OS-level details, you must install the CloudWatch Unified Agent on the EC2 instance.  The agent needs permissions to send these metrics to the CloudWatch service, and the most secure way to grant these permissions is by attaching an IAM Role to the instance. ",
        "wrongExplanation": "Why A is incorrect: AWS does not automatically install the agent.  This is a manual or automated (e.g., via User Data or Systems Manager) step that the administrator must perform. \nWhy C is incorrect: Using an IAM user's credentials on an instance is a security anti-pattern.  IAM roles are the correct mechanism for granting permissions to EC2 instances. \nWhy D is incorrect: Security groups control network traffic to and from the instance.  They are not used to grant permissions to call AWS APIs like CloudWatch.  IAM roles are used for that purpose. "
    },
    {
        "number": 39,
        "title": "",
        "scenario": "A company is migrating its production file server to AWS.  The data must remain accessible if an entire Availability Zone becomes unavailable or during system maintenance.  Users need to interact with the file server using the SMB protocol and manage permissions with Windows ACLS. ",
        "questionText": "Which solution will meet these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create a single AWS Storage Gateway file gateway. "
            },
            {
                "letter": "B",
                "text": "Create an Amazon FSx for Windows File Server Multi-AZ file system. "
            },
            {
                "letter": "C",
                "text": "Deploy two AWS Storage Gateway file gateways across two Availability Zones. Configure an Application Load Balancer in front of the file gateways. "
            },
            {
                "letter": "D",
                "text": "Deploy two Amazon FSx for Windows File Server Single-AZ 2 file systems. Configure Microsoft Distributed File System Replication (DFSR). "
            }
        ],
        "correctAnswers": ["B"],
        "explanation": "Correct Answer: B \nExplanation:\nThe key requirements are high availability across AZs, SMB protocol support, and Windows ACLS.  Why B is correct: Amazon FSx for Windows File Server is the purpose-built service for this use case.  It is a fully managed Windows file server that supports SMB and Windows ACLs.  Crucially, the Multi-AZ deployment option automatically provisions and manages a standby file server in a different AZ, with automatic failover.  This directly meets the high availability requirement with the least operational overhead. ",
        "wrongExplanation": "Why A is incorrect: A single file gateway would be a single point of failure and would not survive an AZ outage. \nWhy C is incorrect: This is an overly complex and likely unworkable solution.  Load balancing file gateways is not a standard or simple configuration. \nWhy D is incorrect: While this could be made to work, it requires the administrator to manually set up, manage, and monitor DFSR between two separate file systems.  The Multi-AZ option in FSx (Option B) provides this same high availability in a fully managed, more operationally efficient way. "
    },
    {
        "number": 40,
        "title": "",
        "scenario": "A SysOps administrator is analyzing the performance of a database running on a single Amazon RDS DB instance.  During peak traffic, the database is overutilized due to a high amount of read traffic. ",
        "questionText": "Which actions should the SysOps administrator take to improve RDS performance? (CHOOSE TWO.) ",
        "isMultiChoice": true,
        "options": [
            {
                "letter": "A",
                "text": "Add a read replica. "
            },
            {
                "letter": "B",
                "text": "Modify the application to use Amazon ElastiCache for Memcached. "
            },
            {
                "letter": "C",
                "text": "Migrate the database from RDS to Amazon DynamoDB. "
            },
            {
                "letter": "D",
                "text": "Migrate the database to Amazon EC2 with enhanced networking enabled. "
            },
            {
                "letter": "E",
                "text": "Upgrade the database to a Multi-AZ deployment. "
            }
        ],
        "correctAnswers": ["A", "B"],
        "explanation": "Correct Answers: A and B \nExplanation:\nThe problem is specifically stated as being caused by excessive read traffic.  Why A is correct: An RDS Read Replica is a read-only copy of your primary database.  You can direct your application's read queries to the replica, which offloads the read traffic from the primary writeable instance.  This is a primary strategy for scaling the read capacity of a relational database.  Why B is correct: Amazon ElastiCache provides an in-memory cache.  By caching frequently requested data (the results of common read queries), the application can retrieve the data from the fast in-memory cache instead of hitting the database every time.  This dramatically reduces the read load on the database. ",
        "wrongExplanation": "Why C is incorrect: Migrating to DynamoDB (a NoSQL database) from a relational database is a massive architectural change and not a simple \"performance improvement \".  It may not even be suitable for the application's data model. \nWhy D is incorrect: Migrating from a managed service (RDS) to a self-managed database on EC2 increases operational overhead.  While enhanced networking improves network performance, the bottleneck is described as resource overutilization from reads, not network throughput. \nWhy E is incorrect: A Multi-AZ deployment is a high-availability and disaster recovery feature.  It creates a synchronous standby replica in a different AZ for failover purposes.  It does not improve performance or offload read traffic; the standby instance is not accessible for read queries. "
    },
    {
        "number": 41,
        "title": "VPC Flow Logs Troubleshooting",
        "scenario": "Application A runs on EC2 instances in an Auto Scaling group behind a Network Load Balancer (NLB). The instances and the NLB are in the same subnet. On-premises applications cannot communicate with Application A on port 8080. A flow log analysis shows an ACCEPT record for inbound traffic to the instance, followed by a REJECT record for the return traffic. ",
        "questionText": "What is the reason for the rejected traffic? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "The security group of the EC2 instances has no Allow rule for the traffic from the NLB. "
            },
            {
                "letter": "B",
                "text": "The security group of the NLB has no Allow rule for the traffic from the on-premises environment. "
            },
            {
                "letter": "C",
                "text": "The ACL of the on-premises environment does not allow traffic to the AWS environment. "
            },
            {
                "letter": "D",
                "text": "The network ACL that is associated with the subnet does not allow outbound traffic for the ephemeral port range. "
            }
        ],
        "correctAnswers": [
            "D"
        ],
        "explanation": "Why D is correct: Network ACLs are stateless.  The ACCEPT record confirms the inbound NACL rule and the security group allowed the request to reach the EC2 instance.  The REJECT record for the return traffic indicates that the outbound NACL rule is blocking the response.  The response from a web server on port 8080 will be sent to the client's ephemeral port (a random high-numbered port).  The NACL's outbound rules must explicitly allow traffic destined for this ephemeral port range (1024-65535) for the connection to succeed. ",
        "wrongExplanation": "Why A is incorrect: If the security group was blocking the inbound traffic, the first flow log entry would have been a REJECT, not an ACCСЕРТ. \nWhy B is incorrect: Network Load Balancers (historically) did not have security groups attached to them.  Even with recent updates that allow this, the flow log shows the traffic did reach the EC2 instance, so the NLB successfully forwarded it.  The problem is with the return path. \nWhy C is incorrect: The problem is with the return traffic from AWS to on-premises, not the initial traffic from on-premises to AWS. "
    },
    {
        "number": 42,
        "title": "S3 Gateway Endpoint Connectivity",
        "scenario": "A SysOps administrator configures an S3 gateway endpoint in a VPC. The private subnets in the VPC do not have outbound internet access. A user on an EC2 instance in one of these private subnets cannot upload a file to an S3 bucket in the same AWS Region. ",
        "questionText": "Which solution will solve this problem? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Update the EC2 instance role policy to include s3: PutObject access to the target S3 bucket. "
            },
            {
                "letter": "B",
                "text": "Update the EC2 security group to allow outbound traffic to 0.0.0.0/0 for port 80. "
            },
            {
                "letter": "C",
                "text": "Update the EC2 subnet route table to include the S3 prefix list destination routes to the S3 gateway endpoint. "
            },
            {
                "letter": "D",
                "text": "Update the S3 bucket policy to allow s3: PutObject access from the private subnet CIDR block. "
            }
        ],
        "correctAnswers": [
            "C"
        ],
        "explanation": "Why C is correct: A VPC gateway endpoint for S3 works by adding a specific route to your subnet's route table.  This route tells the VPC that any traffic destined for the S3 service (identified by a prefix list) should be sent to the local gateway endpoint instead of out to the internet.  If this route is missing from the private subnet's route table, the EC2 instance has no path to reach S3, as it also has no internet access.  Adding this route establishes the private connection. ",
        "wrongExplanation": "Why A and D are incorrect: While permissions (in the IAM role and the bucket policy) are necessary, they are irrelevant if there is no network path for the EC2 instance to even reach the S3 service.  The problem states the user cannot upload, which implies a connectivity or routing failure, which must be solved first. \nWhy B is incorrect: The purpose of a gateway endpoint is to avoid sending traffic over the internet.  Allowing outbound traffic to the internet is unnecessary and would not use the private endpoint. "
    },
    {
        "number": 43,
        "title": "CloudFormation Component Reusability",
        "scenario": "A company uses AWS CloudFormation. An analysis reveals that the same components (e.g., a standard logging configuration, a security group) are being declared repeatedly in many different templates. A SysOps administrator needs to create dedicated, reusable templates for these common components, which can have their own parameters. ",
        "questionText": "Which solution will meet this requirement? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Develop a CloudFormation change set. "
            },
            {
                "letter": "B",
                "text": "Develop CloudFormation macros. "
            },
            {
                "letter": "C",
                "text": "Develop CloudFormation nested stacks. "
            },
            {
                "letter": "D",
                "text": "Develop CloudFormation stack sets. "
            }
        ],
        "correctAnswers": [
            "C"
        ],
        "explanation": "Why C is correct: Nested stacks are designed for this exact purpose.  You can create a standalone CloudFormation template for a common component (like a load balancer setup).  Then, from your main \"parent\" template, you can reference this component template using the AWS::CloudFormation::Stack resource.  This allows you to build complex stacks from smaller, reusable, and independently maintainable modules. ",
        "wrongExplanation": "Why A is incorrect: A change set is a preview of the changes a template will make to a single stack.  It is not a mechanism for creating reusable components. \nWhy B is incorrect: Macros are a more advanced feature for performing custom processing on templates before they are executed.  They are more complex than what is needed for simple component reuse.  Nested stacks are the standard approach. \nWhy D is incorrect: Stack sets are for deploying the same template across multiple AWS accounts or regions.  They are not for composing a single stack from reusable parts. "
    },
    {
        "number": 44,
        "title": "Cross-Log Group Error Analysis",
        "scenario": "A company has a critical serverless application using multiple AWS Lambda functions. Each function generates a large amount of log data daily in its own Amazon CloudWatch Logs log group. The security team needs a count of application errors, grouped by error type, from across all of these log groups. ",
        "questionText": "What should a SysOps administrator do to meet this requirement? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Perform a CloudWatch Logs Insights query that uses the stats command and count function. "
            },
            {
                "letter": "B",
                "text": "Perform a CloudWatch Logs search that uses the groupby keyword and count function. "
            },
            {
                "letter": "C",
                "text": "Perform an Amazon Athena query that uses the SELECT and GROUP BY keywords. "
            },
            {
                "letter": "D",
                "text": "Perform an Amazon RDS query that uses the SELECT and GROUP BY keywords. "
            }
        ],
        "correctAnswers": [
            "A"
        ],
        "explanation": "Why A is correct: CloudWatch Logs Insights is the purpose-built tool for this job.  It allows you to interactively search and analyze log data in CloudWatch Logs.  It supports querying across multiple log groups simultaneously.  Its query language includes powerful commands like stats and functions like count() and count_distinct(), which are perfect for aggregating data, such as counting errors and grouping them by a field (e.g., stats count(*) by errorType). ",
        "wrongExplanation": "Why B is incorrect: The basic CloudWatch Logs search functionality does not support powerful aggregation and grouping keywords like groupby.  That capability is part of Logs Insights. \nWhy C is incorrect: While you could export the logs to S3 and then query them with Athena, this is a much more complex and less immediate solution than using Logs Insights directly on the log data. \nWhy D is incorrect: RDS is a relational database service.  It has no direct way to query log data stored in CloudWatch Logs. "
    },
    {
        "number": 45,
        "title": "ALB Custom Health Check Configuration",
        "scenario": "A software company runs a workload on Amazon EC2 instances behind an Application Load Balancer (ALB). A SysOps administrator needs to define a custom health check for the EC2 instances. ",
        "questionText": "What is the MOST operationally efficient solution? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Set up each EC2 instance so that it writes its healthy/unhealthy status into a shared Amazon S3 bucket for the ALB to read. "
            },
            {
                "letter": "B",
                "text": "Configure the health check on the ALB and ensure that the Health Check Path setting is correct. "
            },
            {
                "letter": "C",
                "text": "Set up Amazon ElastiCache to track the EC2 instances as they scale in and out. "
            },
            {
                "letter": "D",
                "text": "Configure an Amazon API Gateway health check to ensure custom checks on all of the EC2 instances. "
            }
        ],
        "correctAnswers": [
            "B"
        ],
        "explanation": "Why B is correct: Application Load Balancers have built-in health check functionality.  You configure these health checks on the target group associated with the ALB.  You can specify the protocol, port, and, most importantly, a specific Health Check Path (e.g., /health).  The ALB will then periodically send requests to this path on each registered EC2 instance.  If it receives a successful response (e.g., an HTTP 200 OK), it considers the instance healthy.  This is the standard, built-in, and most efficient way to configure health checks for an ALB. ",
        "wrongExplanation": "Why A, C, and D are incorrect: These are all overly complex, non-standard, and inefficient ways to solve a problem that has a simple, built-in solution.  The ALB is designed to perform these health checks directly. "
    },
    {
        "number": 46,
        "title": "Automated EC2 Restart on High CPU",
        "scenario": "An errant process on an Amazon EC2 instance is known to occasionally consume an entire processor, running at 100% CPU utilization. A SysOps administrator wants to automatically restart the EC2 instance if this problem persists for more than 2 minutes. ",
        "questionText": "How can this be accomplished? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create an Amazon CloudWatch alarm for the EC2 instance with basic monitoring. Add an action to restart the instance. "
            },
            {
                "letter": "B",
                "text": "Create an Amazon CloudWatch alarm for the EC2 instance with detailed monitoring. Add an action to restart the instance. "
            },
            {
                "letter": "C",
                "text": "Create an AWS Lambda function to restart the EC2 instance, invoked on a scheduled basis every 2 minutes. "
            },
            {
                "letter": "D",
                "text": "Create an AWS Lambda function to restart the EC2 instance, invoked by EC2 health checks. "
            }
        ],
        "correctAnswers": [
            "B"
        ],
        "explanation": "Why B is correct: This solution directly addresses the requirements.  A CloudWatch alarm can monitor the CPUUtilization metric.  To meet the \"more than 2 minutes\" requirement, you need a monitoring interval that is less than 2 minutes.  Detailed monitoring provides metrics at a 1-minute frequency.  You can set the alarm to trigger if CPUUtilization is ≥100% for 2 consecutive periods (2 minutes).  CloudWatch alarms can be configured with a built-in EC2 action to Reboot or Recover the instance automatically when the alarm state is reached. ",
        "wrongExplanation": "Why A is incorrect: Basic monitoring for EC2 instances provides data points every 5 minutes.  This is not granular enough to detect a condition that persists for only 2 minutes. \nWhy C is incorrect: Invoking a Lambda function every 2 minutes to check the CPU and then restart the instance is inefficient and not event-driven.  A CloudWatch alarm is the proper event-driven mechanism. \nWhy D is incorrect: EC2 health checks (system and instance status checks) monitor the underlying host and the instance's reachability.  They do not monitor in-guest metrics like CPU utilization. "
    },
    {
        "number": 47,
        "title": "EC2 Placement Group for HPC",
        "scenario": "A company is migrating several high-performance computing (HPC) virtual machines to Amazon EC2. The deployment strategy must minimize network latency and maximize network throughput between the instances. ",
        "questionText": "Which strategy should the SysOps administrator choose to meet these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Deploy the instances in a cluster placement group in one Availability Zone. "
            },
            {
                "letter": "B",
                "text": "Deploy the instances in a partition placement group in two Availability Zones. "
            },
            {
                "letter": "C",
                "text": "Deploy the instances in a partition placement group in one Availability Zone. "
            },
            {
                "letter": "D",
                "text": "Deploy the instances in a spread placement group in two Availability Zones. "
            }
        ],
        "correctAnswers": [
            "A"
        ],
        "explanation": "Why A is correct: A Cluster Placement Group is designed for exactly this use case.  It packs instances close together on the same underlying hardware within a single Availability Zone.  This strategy provides the lowest network latency and highest network throughput possible between the instances in the group, which is ideal for tightly coupled HPC workloads that require extensive inter-node communication. ",
        "wrongExplanation": "Why B and C are incorrect: A Partition Placement Group spreads instances across logical partitions (groups of racks) within one or more AZs.  This strategy is designed for high availability and to reduce the impact of correlated hardware failures (e.g., a rack failure).  It does not prioritize low-latency communication between instances. \nWhy D is incorrect: A Spread Placement Group places each instance on distinct underlying hardware, ensuring that if one piece of hardware fails, only one instance is affected.  This is ideal for maximizing the availability of a small number of critical instances, but it results in higher latency between them compared to a cluster group. "
    },
    {
        "number": 48,
        "title": "AWS Storage Gateway",
        "scenario": "In the AWS Storage Gateway, using the ___ you can cost-effectively and durably archive backup data in Amazon Glacier. ",
        "questionText": "In the AWS Storage Gateway, using the ___ you can cost-effectively and durably archive backup data in Amazon Glacier. ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Gateway-virtual tape library (Gateway-VTL) "
            },
            {
                "letter": "B",
                "text": "Gateway-stored volume "
            },
            {
                "letter": "C",
                "text": "Gateway-cached volume "
            },
            {
                "letter": "D",
                "text": "Volume gateway "
            }
        ],
        "correctAnswers": [
            "A"
        ],
        "explanation": "The Gateway-Virtual Tape Library (Gateway-VTL) allows you to use your existing tape-based backup applications with Amazon Glacier for cost-effective and durable archiving. ",
        "wrongExplanation": ""
    },
    {
        "number": 49,
        "title": "Centralized Identity Management with Active Directory",
        "scenario": "A company uses AWS Organizations to host several applications across multiple AWS accounts.  Several teams are responsible for building and maintaining the infrastructure of the applications across the AWS accounts.  A SysOps administrator must implement a solution to ensure that user accounts and permissions are centrally managed.  The solution must be integrated with the company's existing on-premises Active Directory environment.  The SysOps administrator already has enabled AWS IAM Identity Center (AWS Single Sign-On) and has set up an AWS Direct Connect connection. ",
        "questionText": "What is the MOST operationally efficient solution that meets these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create a Simple AD domain, and establish a forest trust relationship with the on-premises Active Directory domain. Set the Simple AD domain as the identity source for IAM Identity Center. Create the required role-based permission sets. Assign each group of users to the AWS accounts that the group will manage. "
            },
            {
                "letter": "B",
                "text": "Create an Active Directory domain controller on an Amazon EC2 instance that is joined to the on-premises Active Directory domain. Set the Active Directory domain controller as the identity source for IAM Identity Center. Create the required role-based permission sets. Assign each group of users to the AWS accounts that the group will manage. "
            },
            {
                "letter": "C",
                "text": "Create an AD Connector that is associated with the on-premises Active Directory domain. Set the AD Connector as the identity source for IAM Identity Center. Create the required role-based permission sets. \"Assign each group of users to the AWS accounts that the group will manage. "
            },
            {
                "letter": "D",
                "text": "Use the built-in SSO directory as the identity source for IAM Identity Center. Copy the users and groups from the on-premises Active Directory domain. Create the required role-based permission sets. Assign each group of users to the AWS accounts that the group will manage. "
            }
        ],
        "correctAnswers": [
            "C"
        ],
        "explanation": "Why C is correct: An AD Connector provides a centralized way to manage user identities from your existing on-premises Active Directory, reducing the need to create and manage separate user accounts in AWS.  It simplifies administration compared to managing a separate AD domain controller on an EC2 instance or copying users/groups to the built-in directory.  Since AWS Direct Connect is already established, connecting the on-premises AD through an AD Connector leverages the existing network connectivity. ",
        "wrongExplanation": "Why A is incorrect: Creating a Simple AD domain and establishing a forest trust would involve more management overhead than an AD Connector, as you would be managing another Active Directory instance. \nWhy B is incorrect: Creating and managing an Active Directory domain controller on an Amazon EC2 instance adds operational overhead, as you are responsible for patching, backups, and high availability of the EC2 instance and the AD services. \nWhy D is incorrect: Using the built-in SSO directory and copying users/groups is less operationally efficient and more time-consuming, especially for large teams.  Any changes in the on-premises Active Directory would not automatically reflect in IAM Identity Center, requiring manual updates. "
    },
    {
        "number": 50,
        "title": "Route 53 Private Hosted Zone Association",
        "scenario": "A company wants to apply an existing Amazon Route 53 private hosted zone to a new VPC to allow for customized resource name resolution within the VPC.  The SysOps administrator created the VPC and added the appropriate resource record sets to the private hosted zone. ",
        "questionText": "Which step should the SysOps administrator take to complete the setup? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Associate the Route 53 private hosted zone with the VPC. "
            },
            {
                "letter": "B",
                "text": "Create a rule in the default security group for the VPC that allows traffic to the Route 53 Resolver. "
            },
            {
                "letter": "C",
                "text": "Ensure the VPC network ACLs allow traffic to the Route 53 Resolver. "
            },
            {
                "letter": "D",
                "text": "Ensure there is a route to the Route 53 Resolver in each of the VPC route tables. "
            }
        ],
        "correctAnswers": [
            "A"
        ],
        "explanation": "To enable a private hosted zone to resolve DNS queries for resources within a VPC, you must explicitly associate the private hosted zone with that VPC.  This is a fundamental step for private DNS resolution in Route 53. ",
        "wrongExplanation": "Options B, C, and D are generally related to network connectivity but are not the direct action required to link a private hosted zone to a VPC for name resolution. "
    },
    {
        "number": 51,
        "title": "VPN Connectivity Troubleshooting",
        "scenario": "A company has an AWS Site-to-Site VPN connection between on-premises resources and resources that are hosted in a VPC.  A SysOps administrator launches an Amazon EC2 instance that has only a private IP address into a private subnet in the VPC.  The EC2 instance runs Microsoft Windows Server.  A security group for the EC2 instance has rules that allow inbound traffic from the on-premises network over the VPN connection.  The on-premises environment contains a third-party network firewall.  Rules in the third-party network firewall allow Remote Desktop Protocol (RDP) traffic to flow between the on-premises users over the VPN connection.  The on-premises users are unable to connect to the EC2 instance and receive a timeout error. ",
        "questionText": "What should the SysOps administrator do to troubleshoot this issue? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create Amazon CloudWatch logs for the EC2 instance to check for blocked traffic. "
            },
            {
                "letter": "B",
                "text": "Create Amazon CloudWatch logs for the Site-to-Site VPN connection to check for blocked traffic. "
            },
            {
                "letter": "C",
                "text": "Create VPC flow logs for the EC2 instance's elastic network interface to check for rejected traffic. "
            },
            {
                "letter": "D",
                "text": "Instruct users to use EC2 Instance Connect as a connection method. "
            }
        ],
        "correctAnswers": [
            "C"
        ],
        "explanation": "Why C is correct: VPC Flow Logs capture information about the IP traffic going to and from network interfaces in your VPC.  By enabling flow logs for the EC2 instance's elastic network interface, the SysOps administrator can see if RDP traffic is even reaching the instance and if it's being rejected by security groups or Network ACLs within the VPC.  This is crucial for pinpointing where the traffic is being dropped. ",
        "wrongExplanation": "Why A is incorrect: CloudWatch logs for the EC2 instance itself would typically show application-level logs or system logs, not network-level blocked traffic. \nWhy B is incorrect: While VPN CloudWatch logs can show the status of the VPN tunnel, they wouldn't provide detailed information about traffic reaching a specific EC2 instance within the VPC or why it's being dropped at the instance level. \nWhy D is incorrect: EC2 Instance Connect is a connection method primarily for SSH access to Linux instances and is not relevant for troubleshooting RDP connectivity to a Windows Server instance. "
    },
    {
        "number": 52,
        "title": "Web Server Troubleshooting",
        "scenario": "A SysOps administrator has set up a new Amazon EC2 instance as a web server in a public subnet. The instance uses HTTP port 80 and HTTPS port 443. The SysOps administrator has confirmed internet connectivity by downloading operating system updates and software from public repositories. However, the SysOps administrator cannot access the instance from a web browser on the internet. ",
        "questionText": "Which combination of steps should the SysOps administrator take to troubleshoot this issue? (CHOOSE THREE.)",
        "isMultiChoice": true,
        "options": [
            {
                "letter": "A",
                "text": "Ensure that the inbound rules of the instance's security group allow traffic on ports 80 and 443. "
            },
            {
                "letter": "B",
                "text": "Ensure that the outbound rules of the instance's security group allow traffic on ports 80 and 443. "
            },
            {
                "letter": "C",
                "text": "Ensure that ephemeral ports 1024-65535 are allowed in the inbound rules of the network ACL that is associated with the instance's subnet. "
            },
            {
                "letter": "D",
                "text": "Ensure that ephemeral ports 1024-65535 are allowed in the outbound rules of the network ACL that is associated with the instance's subnet. "
            },
            {
                "letter": "E",
                "text": "Ensure that the filtering rules for any firewalls that are running on the instance allow inbound traffic on ports 80 and 443. "
            },
            {
                "letter": "F",
                "text": "Ensure that AWS WAF is turned on for the instance and is blocking web traffic. "
            }
        ],
        "correctAnswers": [
            "A",
            "D",
            "E"
        ],
        "explanation": "Why A is correct: Security groups act as virtual firewalls for EC2 instances.  If the inbound rules for ports 80 and 443 are not open, external web traffic will be blocked from reaching the instance. \nWhy D is correct: Network ACLs are stateless, meaning both inbound and outbound rules must explicitly allow traffic.  When a client initiates a connection to a web server (e.g., on port 80 or 443), the server's response traffic uses ephemeral ports for the return communication.  Therefore, the outbound rules of the network ACL must allow traffic on these ephemeral ports for the web server to send responses back to the client. \nWhy E is correct: An EC2 instance, especially a Microsoft Windows Server, can have its own operating system-level firewall (like Windows Firewall) configured.  If this internal firewall is blocking inbound traffic on ports 80 and 443, web browsers will be unable to access the application, even if AWS security groups and Network ACLs are correctly configured. ",
        "wrongExplanation": "Why B is incorrect: The question states that downloading OS updates worked, which implies outbound traffic on common ports (like 80 and 443 for updates) is already functioning.  The problem is with inbound web access. \nWhy C is incorrect: Ephemeral ports are primarily needed for the outbound return traffic from the web server to the user's client, not for inbound traffic to the web server itself on ports 80 and 443. \nWhy F is incorrect: AWS WAF (Web Application Firewall) is not a default component in a basic EC2 web server setup and is generally used for more advanced web application protection.  Assuming it's the cause of a basic access denied error in an initial setup is unlikely and not a primary troubleshooting step. "
    },
    {
        "number": 53,
        "title": "S3 Request Investigation",
        "scenario": "A SysOps administrator has noticed millions of LIST requests on an Amazon S3 bucket. ",
        "questionText": "Which services or features can the administrator use to investigate where the requests are coming from? (Choose two.) ",
        "isMultiChoice": true,
        "options": [
            {
                "letter": "A",
                "text": "AWS CloudTrail data events "
            },
            {
                "letter": "B",
                "text": "Amazon EventBridge "
            },
            {
                "letter": "C",
                "text": "AWS Health Dashboard "
            },
            {
                "letter": "D",
                "text": "Amazon S3 server access logging "
            },
            {
                "letter": "E",
                "text": "AWS Trusted Advisor "
            }
        ],
        "correctAnswers": [
            "A",
            "D"
        ],
        "explanation": "Why A is correct: AWS CloudTrail records API activity within your AWS account, including S3 bucket access.  By analyzing CloudTrail logs, the administrator can identify the source of the LIST requests, including the caller's identity and IP address. \nWhy D is correct: Enabling server access logging on the S3 bucket allows the administrator to capture detailed records for every request made to the bucket.  This includes the requester's IP address, which can help identify where the requests are originating from. ",
        "wrongExplanation": "Why B is incorrect: Amazon EventBridge is a serverless event bus that connects applications together.  While it can react to events, it doesn't provide detailed logging of S3 LIST requests to identify their source. \nWhy C is incorrect: AWS Health Dashboard provides personalized views of the health of AWS services and resources.  It's for service disruptions or scheduled changes, not for detailed request logging to an S3 bucket. \nWhy E is incorrect: AWS Trusted Advisor provides recommendations to follow AWS best practices in various categories like cost optimization, security, and performance.  It doesn't provide detailed request logs for an S3 bucket. "
    },
    {
        "number": 54,
        "title": "VPC Flow Logs Discrepancy",
        "scenario": "A SysOps administrator configures VPC flow logs to publish to Amazon CloudWatch Logs.  The SysOps administrator reviews the logs in CloudWatch Logs and notices less traffic than expected.  After the SysOps administrator compares the VPC flow logs to logs that were captured on premises, the SysOps administrator believes that the VPC flow logs are incomplete. ",
        "questionText": "Which of the following is a possible reason for the difference in traffic? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "CloudWatch Logs throttling has been applied. "
            },
            {
                "letter": "B",
                "text": "The CloudWatch IAM role does not have a trust relationship with the VPC flow logs service. "
            },
            {
                "letter": "C",
                "text": "The VPC flow log is still in the process of being created. "
            },
            {
                "letter": "D",
                "text": "VPC flow logs cannot capture traffic from on-premises servers to a VPC. "
            }
        ],
        "correctAnswers": [
            "A"
        ],
        "explanation": "Why A is correct: CloudWatch Logs has service quotas and can apply throttling when limits are reached.  If throttling occurs, some log events might be dropped, leading to incomplete log data in CloudWatch Logs.  This is a plausible explanation for missing traffic in CloudWatch Logs when compared to on-premises logs. ",
        "wrongExplanation": "Why B is incorrect: If the IAM role lacked the correct trust relationship or permissions, no logs would be delivered, not just an incomplete set. \nWhy C is incorrect: While there might be a short delay, an \"incomplete\" set of logs due to ongoing creation typically wouldn't be the primary cause of a sustained discrepancy when compared to on-premises logs. \nWhy D is incorrect: VPC Flow Logs do capture information about IP traffic going to and from network interfaces in your VPC, which includes traffic originating from on-premises servers that traverses a connection like a VPN or Direct Connect into the VPC.  The issue isn't that it cannot capture this traffic, but rather that it's incomplete. "
    },
    {
        "number": 55,
        "title": "Changing EC2 Instance Type",
        "scenario": "A company has an Amazon EC2 instance that has high CPU utilization. The EC2 instance is a t3.large instance and is running a test web application. The company discovers that the web application would operate better on a compute optimized large instance. ",
        "questionText": "What should a SysOps administrator do to make this change? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Migrate the EC2 instance to a compute optimized instance by using AWS VM Import/Export. "
            },
            {
                "letter": "B",
                "text": "Enable hibernation on the EC2 instance. Change the instance type to a compute optimized instance. Disable hibernation on the EC2 instance. "
            },
            {
                "letter": "C",
                "text": "Stop the EC2 instance. Change the instance type to a compute optimized instance. Start the EC2 instance. "
            },
            {
                "letter": "D",
                "text": "Change the instance type to a compute optimized instance while the EC2 instance is running. "
            }
        ],
        "correctAnswers": [
            "C"
        ],
        "explanation": "Why C is correct: To change the instance type of an Amazon EC2 instance, you must first stop the instance.  Once stopped, you can modify its instance type to the desired compute-optimized instance.  After the change, you can start the instance again. ",
        "wrongExplanation": "Why A is incorrect: AWS VM Import/Export is used for importing virtual machine images from your on-premises environment into EC2 or exporting them from EC2.  It is not the standard procedure for simply changing the instance type of an existing EC2 instance. \nWhy B is incorrect: Hibernation allows an instance to pause its execution and resume later, but it's not a prerequisite or a mechanism for changing the instance type.  Changing the instance type still requires stopping the instance. \nWhy D is incorrect: It is not possible to change the instance type of a running EC2 instance.  The instance must be in a \"stopped\" state to modify its type. "
    },
    {
        "number": 56,
        "title": "Missing Lambda CloudWatch Logs",
        "scenario": "A development team created and deployed a new AWS Lambda function 15 minutes ago.  Although the function was invoked many times, Amazon CloudWatch Logs are not showing any log messages. ",
        "questionText": "What is one cause of this? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "The developers did not enable log messages for this Lambda function. "
            },
            {
                "letter": "B",
                "text": "The Lambda function's role does not include permissions to create CloudWatch Logs items. "
            },
            {
                "letter": "C",
                "text": "The Lambda function raises an exception before the first log statement has been reached. "
            },
            {
                "letter": "D",
                "text": "The Lambda functions creates local log files that have to be shipped to CloudWatch Logs first before becoming visible. "
            }
        ],
        "correctAnswers": [
            "B"
        ],
        "explanation": "Why B is correct: For an AWS Lambda function to send its logs to Amazon CloudWatch Logs, the IAM execution role associated with the Lambda function must have the necessary permissions (e.g., logs:CreateLogGroup, logs:CreateLogStream, and logs: PutLogEvents).  If these permissions are missing, the Lambda function will execute but will not be able to publish its logs to CloudWatch Logs. ",
        "wrongExplanation": "Why A is incorrect: Lambda functions generally have logging enabled by default to CloudWatch Logs if the permissions are correctly set.  Developers explicitly disable logging or direct it elsewhere, but it's less common than a permissions issue. \nWhy C is incorrect: Even if a Lambda function raises an exception early, the runtime environment often attempts to log the error.  A complete lack of any log messages, despite invocations, strongly points to a permissions problem rather than an early exception before a log statement. \nWhy D is incorrect: AWS Lambda integrates directly with CloudWatch Logs.  It doesn't create local log files on the Lambda execution environment that then need to be manually \"shipped.\"  Logs are streamed directly to CloudWatch Logs. "
    },
    {
        "number": 57,
        "title": "CloudWatch Alarm in INSUFFICIENT_DATA State",
        "scenario": "A company observes that a newly created Amazon CloudWatch alarm is not transitioning out of the INSUFFICIENT_DATA state.  The alarm was created to track the mem_used_percent metric from an Amazon EC2 instance that is deployed in a public subnet.  A review of the EC2 instance shows that the unified CloudWatch agent is installed and is running.  However, the metric is not available in CloudWatch.  A SysOps administrator needs to implement a solution to resolve this problem. ",
        "questionText": "Which solution will meet these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Enable CloudWatch detailed monitoring for the EC2 instance "
            },
            {
                "letter": "B",
                "text": "Create an IAM instance profile that contains CloudWatch permissions. Add the instance profile to the EC2 instance "
            },
            {
                "letter": "C",
                "text": "Migrate the EC2 instance into a private subnet "
            },
            {
                "letter": "D",
                "text": "Create an IAM user that has an access key ID and a secret access key. Update the unified CloudWatch agent configuration file to use those credentials "
            }
        ],
        "correctAnswers": [
            "B"
        ],
        "explanation": "Why B is correct: Even if the CloudWatch agent is installed and running, it needs the necessary permissions to publish custom metrics (like mem_used_percent) to CloudWatch.  The most secure and recommended AWS best practice for granting permissions to EC2 instances is by attaching an IAM instance profile with the required CloudWatch permissions (e.g., cloudwatch: PutMetricData).  This eliminates the need to manage access keys directly on the instance. ",
        "wrongExplanation": "Why A is incorrect: CloudWatch detailed monitoring applies to standard EC2 metrics (like CPU Utilization, Network In/Out), not custom metrics collected by the CloudWatch agent. \nWhy C is incorrect: Migrating the EC2 instance to a private subnet will not resolve the issue of the CloudWatch agent lacking permissions to send metrics.  Network connectivity is likely not the issue since the instance is in a public subnet and has internet connectivity. \nWhy D is incorrect: While creating an IAM user with access keys could provide the necessary permissions, it is explicitly not an AWS best practice for EC2 instances.  Attaching an IAM instance profile is the preferred, more secure, and operationally efficient method as it avoids embedding credentials directly on the instance. "
    },
    {
        "number": 58,
        "title": "S3 Upload Integrity Check",
        "scenario": "A company is uploading important files as objects to Amazon S3.  The company needs to be informed if an object is corrupted during the upload. ",
        "questionText": "What should a SysOps administrator do to meet this requirement? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Pass the Content-Disposition value as a request body during the object upload "
            },
            {
                "letter": "B",
                "text": "Pass the Content-MD5 value as a request header during the object upload "
            },
            {
                "letter": "C",
                "text": "Pass x-amz-object-lock-mode as a request header during the object upload "
            },
            {
                "letter": "D",
                "text": "Pass x-amz-server-side-encryption-customer-algorithm as a request body during the object upload "
            }
        ],
        "correctAnswers": [
            "B"
        ],
        "explanation": "Why B is correct: To verify the integrity of an object after uploading it to Amazon S3, you can provide an MD5 digest of the object during the upload.  If you calculate the MD5 digest for your object, you can include it with the PUT command by using the Content-MD5 header.  Amazon S3 uses this value to check the object integrity during transmission and will return an error if the computed MD5 hash does not match the one provided, indicating potential corruption. ",
        "wrongExplanation": "Why A is incorrect: Content-Disposition is an HTTP header that provides information about how a response should be displayed (e.g., as an attachment, inline) and is not used for data integrity checks during upload. \nWhy C is incorrect: x-amz-object-lock-mode is an S3 Object Lock header used for data retention and immutability, not for verifying upload integrity. \nWhy D is incorrect: x-amz-server-side-encryption-customer-algorithm is related to server-side encryption with customer-provided keys (SSE-C) and does not directly inform about upload corruption.  It's a header for specifying the encryption algorithm. "
    },
    {
        "number": 59,
        "title": "ALB Traffic Analysis",
        "scenario": "A SysOps administrator needs to create a report that shows how many bytes are sent to and received from each target group member for an Application Load Balancer (ALB). ",
        "questionText": "Which combination of steps should the SysOps administrator take to meet these requirements? (CHOOSE TWO.) ",
        "isMultiChoice": true,
        "options": [
            {
                "letter": "A",
                "text": "Enable access logging for the ALB. Save the logs to an Amazon S3 bucket. "
            },
            {
                "letter": "B",
                "text": "Install the Amazon CloudWatch agent on the instances in the target group. "
            },
            {
                "letter": "C",
                "text": "Use Amazon Athena to query the ALB logs. Query the table. Use the received_bytes and sent_bytes fields to calculate the total bytes grouped by the target port field. "
            },
            {
                "letter": "D",
                "text": "Use Amazon Athena to query the ALB logs. Query the table. Use the received_bytes and sent_bytes fields to calculate the total bytes grouped by the client port field. "
            },
            {
                "letter": "E",
                "text": "Create an Amazon CloudWatch dashboard that shows the Sum statistic of the ProcessedBytes metric for the ALB. "
            }
        ],
        "correctAnswers": [
            "A",
            "C"
        ],
        "explanation": "Why A is correct: Application Load Balancer (ALB) access logs capture detailed information about requests sent to your load balancer, including the sent_bytes and received_bytes for each request.  These logs can be configured to be delivered to an Amazon S3 bucket. \nWhy C is correct: Amazon Athena is an interactive query service that makes it easy to analyze data directly in Amazon S3 using standard SQL.  Once ALB access logs are stored in S3 (from step A), Athena can be used to query these logs.  The ALB logs contain fields like received_bytes and sent_bytes which can be aggregated and grouped by the target_port field to identify data transfer per target group member.  The target port helps identify the specific member within the target group. ",
        "wrongExplanation": "Why B is incorrect: Installing the CloudWatch agent on target group instances would collect metrics from the instances (e.g., CPU, memory) but would not provide the detailed per-request bytes sent and received by the ALB for each target group member. \nWhy D is incorrect: While Athena is the right tool, grouping by client_port would show data per client connection, not per target group member.  The question asks for data per target group member. \nWhy E is incorrect: The ProcessedBytes metric in CloudWatch for ALBs provides the total number of bytes processed by the load balancer.  However, it does not break down the bytes sent to and received from each individual target group member, which is the specific requirement of the question. "
    },
    {
        "number": 60,
        "title": "Interactive Session Auditing",
        "scenario": "A company runs thousands of Amazon EC2 instances that are based on the Amazon Linux 2 Amazon Machine Image (AMI).  A SysOps administrator must implement a solution to record commands and output from any user that needs an interactive session on one of the EC2 instances.  The solution must log the data to a durable storage location.  The solution also must provide automated notifications and alarms that are based on the log data. ",
        "questionText": "Which solution will meet these requirements with the MOST operational efficiency? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Configure command session logging on each EC2 instance. Configure the unified Amazon CloudWatch agent to send session logs to Amazon CloudWatch Logs. Set up query filters and alerts by using Amazon Athena. "
            },
            {
                "letter": "B",
                "text": "Require all users to use a central bastion host when they need command line access to an EC2 instance. Configure the unified Amazon CloudWatch agent on the bastion host to send session logs to Amazon CloudWatch Logs. Set up a metric filter and a metric alarm for relevant security findings in CloudWatch Logs. "
            },
            {
                "letter": "C",
                "text": "Require all users to use AWS Systems Manager Session Manager when they need command line access to an EC2 instance. Configure Session Manager to stream session logs to Amazon CloudWatch Logs. Set up a metric filter and a metric alarm for relevant security findings in CloudWatch Logs. "
            },
            {
                "letter": "D",
                "text": "Configure command session logging on each EC2 instance. Require all users to use AWS Systems Manager Run Command documents when they need command line access to an EC2 instance. Configure the unified Amazon CloudWatch agent to send session logs to Amazon CloudWatch Logs. Set up CloudWatch alarms that are based on Amazon Athena query results. "
            }
        ],
        "correctAnswers": [
            "C"
        ],
        "explanation": "Why C is correct: For managing thousands of instances with interactive sessions and robust logging, AWS Systems Manager Session Manager is the most operationally efficient solution.  It eliminates the need to open inbound ports, manage SSH keys, or create bastion hosts.  Session Manager allows you to record session data (commands and output) directly to Amazon S3 or Amazon CloudWatch Logs.  Once in CloudWatch Logs, you can easily set up metric filters and alarms for specific security findings or patterns in the log data. ",
        "wrongExplanation": "Why A is incorrect: Configuring command session logging on each EC2 instance manually (or even via a script) for thousands of instances is not operationally efficient.  While sending logs to CloudWatch Logs and using Athena is a valid analysis method, the initial setup and ongoing management of logging on individual instances would be burdensome at scale. \nWhy B is incorrect: Using a central bastion host introduces a single point of failure and a potential bottleneck for command-line access.  While it centralizes logging, it adds management complexity for the bastion host itself and doesn't scale as efficiently as Session Manager for thousands of instances. \nWhy D is incorrect: AWS Systems Manager Run Command is for executing commands remotely and non-interactively.  The requirement specifically mentions \"interactive sessions.\"  While it can run scripts that configure logging, it's not designed for the interactive session management and recording that Session Manager provides. "
    },
    {
        "number": 61,
        "title": "SAML Federation Prerequisites",
        "scenario": "A company that uses AWS Organizations recently implemented AWS Control Tower. The company now needs to centralize identity management.  A SysOps administrator must federate AWS IAM Identity Center with an external SAML 2.0 identity provider (IdP) to centrally manage access to all the company's accounts and cloud applications. ",
        "questionText": "Which prerequisites must the SysOps administrator have so that the SysOps administrator can connect to the external IdP? (CHOOSE TWO.) ",
        "isMultiChoice": true,
        "options": [
            {
                "letter": "A",
                "text": "A copy of the IAM Identity Center SAML metadata "
            },
            {
                "letter": "B",
                "text": "The IdP metadata including the public X.509 certificate "
            },
            {
                "letter": "C",
                "text": "The IP address of the IdP "
            },
            {
                "letter": "D",
                "text": "Root access to the management account "
            },
            {
                "letter": "E",
                "text": "Administrative permissions to the member accounts of the organization "
            }
        ],
        "correctAnswers": [
            "A",
            "B"
        ],
        "explanation": "Why A is correct: When setting up SAML federation between AWS IAM Identity Center and an external IdP, a copy of the IAM Identity Center SAML metadata is required by your external identity provider.  This metadata provides the IdP with information about IAM Identity Center as the service provider, including the assertion consumer service (ACS) URL and the service provider entity ID. \nWhy B is correct: The IdP's metadata, including its public X.509 certificate, is essential for IAM Identity Center to trust the assertions sent from the external identity provider.  This certificate is used to verify the digital signatures on SAML assertions. ",
        "wrongExplanation": "Why C is incorrect: SAML federation relies on metadata exchange, not direct IP address communication between the IdP and AWS. \nWhy D is incorrect: While AWS Control Tower and AWS Organizations management account have high privileges, root access is generally not required for configuring IAM Identity Center and its federation with an external IdP.  Best practices recommend using IAM users or roles with specific permissions for daily operations. \nWhy E is incorrect: IAM Identity Center centrally manages permissions for all accounts in an AWS Organization.  You assign permission sets to groups of users, and these permissions are then propagated to the member accounts.  Direct administrative permissions to each member account individually are not a prerequisite for setting up the federation itself, though they would be needed for managing resources within those accounts after federation. "
    },
    {
        "number": 62,
        "title": "CloudWatch Logs for EC2",
        "scenario": "A company recently moved its server infrastructure to Amazon EC2 instances.  The company wants to use Amazon CloudWatch Logs to track the instance logs. ",
        "questionText": "What should a SysOps administrator do to meet this requirement in compliance with AWS best practices? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Configure CloudWatch from the AWS Management Console for the instances. Wait for AWS to automatically install and configure the agents for the instances "
            },
            {
                "letter": "B",
                "text": "Install and configure the CloudWatch agent on the instances. Attach an IAM role to allow the instances to write logs to CloudWatch "
            },
            {
                "letter": "C",
                "text": "Install and configure the CloudWatch agent on the instances. Attach an IAM user to allow the instances to write logs to CloudWatch "
            },
            {
                "letter": "D",
                "text": "Install and configure the CloudWatch agent on the instances. Attach the necessary security groups to allow the instances to write logs to CloudWatch "
            }
        ],
        "correctAnswers": [
            "B"
        ],
        "explanation": "Why B is correct: To send instance logs to CloudWatch Logs, you need to install and configure the CloudWatch agent on the EC2 instances.  Crucially, in line with AWS best practices, you should attach an IAM role to the EC2 instance.  This IAM role will contain the necessary permissions (e.g., logs:CreateLogGroup, logs:CreateLogStream, logs: PutLogEvents) that allow the agent to write logs to CloudWatch on behalf of the instance.  Using IAM roles for EC2 instances is the most secure and scalable method for granting AWS service permissions, as it avoids managing static credentials. ",
        "wrongExplanation": "Why A is incorrect: AWS does not automatically install and configure the CloudWatch agent for instance logs by simply configuring CloudWatch from the console.  The agent needs to be explicitly installed and configured on the instance. \nWhy C is incorrect: While attaching an IAM user with access keys could grant permissions, using IAM users with access keys directly on EC2 instances is generally considered an anti-pattern and not an AWS best practice.  IAM roles are preferred for instances. \nWhy D is incorrect: Security groups control network traffic (inbound/outbound) to and from the EC2 instance.  While network connectivity is necessary for the agent to reach CloudWatch, security groups alone do not provide the authentication and authorization permissions required for the agent to write logs to CloudWatch Logs.  That's the function of an IAM role. "
    },
    {
        "number": 63,
        "title": "CloudFormation Stack Deletion Failure",
        "scenario": "A company uses AWS CloudFormation to deploy its infrastructure. The company recently retired an application.  A cloud operations engineer initiates CloudFormation stack deletion, and the stack gets stuck in DELETE_FAILED status.  A SysOps administrator discovers that the stack had deployed a security group.  The security group is referenced by other security groups in the environment.  The SysOps administrator needs to delete the stack without affecting other applications. ",
        "questionText": "Which solution will meet these requirements in the MOST operationally efficient manner? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create a new security group that has a different name. Apply identical rules to the new security group. Replace all other security groups that reference the new security group Delete the stack. "
            },
            {
                "letter": "B",
                "text": "Create a CloudFormation change set to delete the security group. Deploy the change set. "
            },
            {
                "letter": "C",
                "text": "Delete the stack again. Specify that the security group be retained. "
            },
            {
                "letter": "D",
                "text": "Perform CloudFormation drift detection. Delete the stack. "
            }
        ],
        "correctAnswers": [
            "C"
        ],
        "explanation": "Why C is correct: When a CloudFormation stack deletion fails because a resource is still in use (like a security group referenced by others), the most operationally efficient way to proceed without affecting other applications is to delete the stack again and specifically tell CloudFormation to retain the problematic resource (the security group).  This allows the stack deletion to complete, and the security group, still being used by other applications, remains untouched.  You can later manually manage or delete the retained security group once its dependencies are removed.  For example, using the AWS CLI, you can use aws cloudformation delete-stack --stack-name my-stack --retain-resources mysg1. ",
        "wrongExplanation": "Why A is incorrect: This is a very inefficient and manual process.  It involves creating a new security group, copying rules, updating all dependent security groups, and then deleting the old one.  This would be time-consuming and error-prone, especially in a large environment. \nWhy B is incorrect: A CloudFormation change set allows you to preview how changes to your stack template might affect your running resources before you implement them.  It does not prevent errors during stack deletion when a resource is still in use by external dependencies. \nWhy D is incorrect: CloudFormation drift detection identifies stack resources whose actual configuration differs from their template.  It is a tool for identifying configuration changes outside of CloudFormation, not a method for forcing stack deletion while retaining dependent resources. "
    },
    {
        "number": 64,
        "title": "Website Uptime Monitoring",
        "scenario": "A company needs to monitor its website's availability to end users.  The company needs a solution to provide an Amazon Simple Notification Service (Amazon SNS) notification if the website's uptime decreases to less than 99%.  The monitoring must provide an accurate view of the user experience on the website. ",
        "questionText": "Which solution will meet these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create an Amazon CloudWatch alarm that is based on the website's logs that are published to a CloudWatch Logs log group. Configure the alarm to publish an SNS notification if the number of HTTP 4xx errors and 5xx errors exceeds a specified threshold. "
            },
            {
                "letter": "B",
                "text": "Create an Amazon CloudWatch alarm that is based on the website's published metrics in CloudWatch. Configure the alarm to publish an SNS notification that is based on anomaly detection. "
            },
            {
                "letter": "C",
                "text": "Create an Amazon CloudWatch Synthetics heartbeat monitoring canary. Associate the canary with the website's URL for end users. Create a CloudWatch alarm for the canary. Configure the alarm to publish an SNS notification if the value of the SuccessPercent metric is less than 99%. "
            },
            {
                "letter": "D",
                "text": "Create an Amazon CloudWatch Synthetics broken link checker monitoring canary. Associate the canary with the website's URL for end users. Create a CloudWatch alarm for the canary. Configure the alarm to publish an SNS notification if the value of the SuccessPercent metric is less than 99%. "
            }
        ],
        "correctAnswers": [
            "C"
        ],
        "explanation": "Why C is correct: Amazon CloudWatch Synthetics allows you to create canaries, which are configurable scripts that run on a schedule to monitor your endpoints and APIs.  A \"heartbeat monitoring canary\" loads the specified URL and collects metrics like SuccessPercent.  This provides a proactive, external, and accurate view of the user experience.  By setting a CloudWatch alarm on the Success Percent metric to trigger below 99%, you directly address the uptime requirement and send an SNS notification. ",
        "wrongExplanation": "Why A is incorrect: While monitoring HTTP 4xx/5xx errors from logs is valuable, it's a reactive measure that depends on actual user traffic.  It doesn't provide a continuous, synthetic check of availability from an end-user perspective if there's no traffic. \nWhy B is incorrect: Anomaly detection on general website metrics might indicate an issue, but it doesn't directly measure uptime from a user's perspective, nor is it as specific for availability as a synthetic canary. \nWhy D is incorrect: A \"broken link checker\" canary specifically looks for broken links on a webpage.  While it is a type of synthetic canary and uses SuccessPercent, it's not the primary or most direct way to monitor overall website uptime/availability to end users as defined by a 99% uptime requirement.  The \"heartbeat monitoring\" blueprint is more suitable for general availability checks. "
    },
    {
        "number": 65,
        "title": "Multi-Account SSL/TLS Certificate",
        "scenario": "A company uses a multi-account structure in the AWS Cloud. The company's environment includes a shared account for common resources. The environment also includes a development account for new application development. The company uses Amazon Route 53 for DNS management. The company manages all its Route 53 hosted zones from the shared account. A SysOps administrator needs to obtain a new SSL/TLS certificate for an application that is deployed in the development account. ",
        "questionText": "What must the SysOps administrator do to meet this requirement? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create a new AWS Key Management Service (AWS KMS) key in the shared account. Configure the key policy to give read access to the development account's root principal. "
            },
            {
                "letter": "B",
                "text": "Request a new certificate by using AWS Certificate Manager (ACM) from the shared account. Use Route 53 from the shared account to create validation record sets in the relevant hosted zone. "
            },
            {
                "letter": "C",
                "text": "Request a new certificate by using AWS Certificate Manager (ACM) from the development account. Use Route 53 from the shared account to create validation record sets in the relevant hosted zone. "
            },
            {
                "letter": "D",
                "text": "Create a new AWS Key Management Service (AWS KMS) key in the development account. Configure the key policy to give read access to the shared account's root principal. Use Route 53 from the shared account to create a validation record set that references the Amazon Resource Name (ARN) of the KMS key. "
            }
        ],
        "correctAnswers": [
            "C"
        ],
        "explanation": "Why C is correct: ACM certificates are region-specific and are generally intended to be used within the AWS account where the application requiring the certificate resides.  Since the application is deployed in the development account, the certificate should be requested from that account.  However, since the Route 53 hosted zone for DNS validation is managed in the shared account, the SysOps administrator will need to use Route 53 in the shared account to create the necessary DNS validation record sets.  This allows ACM in the development account to validate domain ownership using the DNS records in the shared account's Route 53. ",
        "wrongExplanation": "Why A and D are incorrect: KMS keys are used for encryption, not for requesting or validating SSL/TLS certificates.  They are irrelevant to the process of obtaining an ACM certificate. \nWhy B is incorrect: Requesting the certificate from the shared account would mean the certificate is in the shared account.  While technically possible, it's not the recommended practice if the application needing the certificate is in a different account.  Managing certificates in the same account as the application simplifies linking and use with services like ALBs or CloudFront.  The question also asks for the most operationally efficient solution, and keeping the certificate with the consuming application is generally more efficient for management and deployment. "
    },
    {
        "number": 66,
        "title": "VPC Flow Logs Publishing Issues",
        "scenario": "A company's SysOps administrator is troubleshooting communication between the components of an application.  The company configured VPC flow logs to be published to Amazon CloudWatch Logs.  However, there are no logs in CloudWatch Logs. ",
        "questionText": "What could be blocking the VPC flow logs from being published to CloudWatch Logs? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "The IAM policy that is attached to the IAM role for the flow log is missing the logs: CreateLogGroup permission "
            },
            {
                "letter": "B",
                "text": "The IAM policy that is attached to the IAM role for the flow log is missing the logs:CreateExport Task permission "
            },
            {
                "letter": "C",
                "text": "The VPC is configured for IPv6 addresses "
            },
            {
                "letter": "D",
                "text": "The VPC is peered with another VPC in the AWS account "
            }
        ],
        "correctAnswers": [
            "A"
        ],
        "explanation": "Why A is correct: To publish VPC flow logs to CloudWatch Logs, the IAM role associated with the flow log must have specific permissions that allow it to create log groups, create log streams, and put log events in CloudWatch Logs.  If the logs:CreateLogGroup permission (or other necessary logs permissions like logs:CreateLogStream or logs: PutLogEvents) is missing from the IAM policy attached to the flow log's role, the flow logs will not be able to create the required log group in CloudWatch Logs, and therefore, no logs will appear. ",
        "wrongExplanation": "Why B is incorrect: logs:CreateExportTask is a permission related to exporting logs from CloudWatch Logs to Amazon S3 or other destinations.  It is not required for the initial publishing of flow logs to CloudWatch Logs. \nWhy C is incorrect: VPC flow logs support both IPv4 and IPv6 traffic.  The presence of IPv6 addresses does not prevent flow logs from being published. \nWhy D is incorrect: VPC peering connections do not inherently block flow logs from being published.  Flow logs can capture traffic across peered VPCs if configured to do so. "
    },
    {
        "number": 67,
        "title": "Auto Scaling Group Creation",
        "scenario": "",
        "questionText": "Which of the following comes before Auto Scaling group creation? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Creating the Auto Scaling launch config "
            },
            {
                "letter": "B",
                "text": "Creating the Auto Scaling policy "
            },
            {
                "letter": "C",
                "text": "Creating the Auto Scaling tags "
            },
            {
                "letter": "D",
                "text": "Creating the Auto Scaling instance "
            }
        ],
        "correctAnswers": [
            "A"
        ],
        "explanation": "Why A is correct: Before you can create an Auto Scaling group, you must define a launch configuration (or a launch template).  The launch configuration acts as a template for the EC2 instances that the Auto Scaling group will launch.  It specifies parameters such as the Amazon Machine Image (AMI), instance type, key pair, security groups, and user data.  Without this blueprint, the Auto Scaling group wouldn't know what kind of instances to launch. ",
        "wrongExplanation": "Why B is incorrect: Auto Scaling policies define how the Auto Scaling group scales in or out (e.g., target tracking, simple scaling, step scaling).  These are configured after the Auto Scaling group has been created. \nWhy C is incorrect: Tags are metadata that you can add to your Auto Scaling groups and the instances they launch.  They are applied during or after the creation of the Auto Scaling group. \nWhy D is incorrect: The Auto Scaling group itself creates instances based on the launch configuration.  You don't create the \"Auto Scaling instance\" separately before the group. "
    },
    {
        "number": 68,
        "title": "DynamoDB Tagging Enforcement",
        "scenario": "A company needs to enforce tagging requirements for Amazon DynamoDB tables in its AWS accounts.  A SysOps administrator must implement a solution to identify and remediate all DynamoDB tables that do not have the appropriate tags. ",
        "questionText": "Which solution will meet these requirements with the LEAST operational overhead? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create a custom AWS Lambda function to evaluate and remediate all DynamoDB tables. Create an Amazon EventBridge scheduled rule to invoke the Lambda function. "
            },
            {
                "letter": "B",
                "text": "Create a custom AWS Lambda function to evaluate and remediate all DynamoDB tables. Create an AWS Config custom rule to invoke the Lambda function. "
            },
            {
                "letter": "C",
                "text": "Use the required-tags AWS Config managed rule to evaluate all DynamoDB tables for the appropriate tags. Configure an automatic remediation action that uses an AWS Systems Manager Automation custom runbook. "
            },
            {
                "letter": "D",
                "text": "Create an Amazon EventBridge managed rule to evaluate all DynamoDB tables for the appropriate tags. Configure the EventBridge rule to run an AWS Systems Manager Automation custom runbook for remediation. "
            }
        ],
        "correctAnswers": [
            "C"
        ],
        "explanation": "Why C is correct: AWS Config managed rules are pre-defined rules provided by AWS that simplify compliance checking.  The required-tags managed rule specifically checks if resources have the tags you specify.  AWS Config can then be configured with automatic remediation actions, where it triggers an AWS Systems Manager Automation document (which can be a custom runbook) to automatically apply the required tags or perform other remediation steps on non-compliant resources.  This approach offers the least operational overhead because it leverages existing AWS services and managed rules, requiring minimal custom code or infrastructure setup. ",
        "wrongExplanation": "Why A and B are incorrect: While a custom Lambda function can perform evaluation and remediation, using AWS Config managed rules (Option C) significantly reduces the operational overhead by eliminating the need to write and maintain custom Lambda code for evaluation logic that is already provided by AWS.  Option B is better than A as it uses Config for evaluation, but still requires a custom Lambda. \nWhy D is incorrect: Amazon EventBridge is an event bus that can react to changes, but AWS Config is specifically designed for evaluating resource configurations against desired states and enforcing compliance, making it more suitable for this tagging enforcement scenario.  While EventBridge can trigger Automation runbooks, the initial evaluation and identification of non-compliant resources are best handled by AWS Config for this use case. "
    },
    {
        "number": 69,
        "title": "S3 Static Website Hosting Error",
        "scenario": "A company is using Amazon S3 to set up a temporary static website that is public.  A SysOps administrator creates an S3 bucket by using the default settings.  The SysOps administrator updates the S3 bucket properties to configure static website hosting.  The SysOps administrator then uploads objects that contain content for index.html and error.html.  When the SysOps administrator navigates to the website URL the SysOps administrator receives an HTTP Status Code 403: Forbidden (Access Denied) error. ",
        "questionText": "What should the SysOps administrator do to resolve this error? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create an Amazon Route 53 DNS entry Point the entry to the S3 bucket. "
            },
            {
                "letter": "B",
                "text": "Edit the S3 bucket permissions by turning off Block Public Access settings. Create a bucket policy to allow GetObject access on the S3 bucket. "
            },
            {
                "letter": "C",
                "text": "Edit the permissions on the index.html and error.html files for read access. "
            },
            {
                "letter": "D",
                "text": "Edit the S3 bucket permissions by turning off Block Public Access settings. Create a bucket policy to allow PutObject access on the S3 bucket. "
            }
        ],
        "correctAnswers": [
            "B"
        ],
        "explanation": "Why B is correct: By default, new S3 buckets have \"Block Public Access\" settings enabled, which prevents public access to objects even if bucket policies allow it.  For a public static website, you must first disable these \"Block Public Access\" settings.  After that, you need to create a bucket policy that explicitly grants s3:GetObject permission to anonymous users for the objects in the bucket, allowing web browsers to retrieve the index.html and error.html files. ",
        "wrongExplanation": "Why A is incorrect: Creating a Route 53 DNS entry is for mapping a custom domain name to the S3 static website endpoint.  While often done for production websites, it doesn't resolve an Access Denied error from the S3 website URL itself. \nWhy C is incorrect: While object-level ACLs could grant read access, managing permissions via a bucket policy (as in Option B) is generally more scalable and recommended for static website hosting, especially when combined with the Block Public Access settings.  The primary issue here is typically the bucket-level public access blocking. \nWhy D is incorrect: Granting s3: PutObject access would allow users to upload objects, which is a significant security risk for a public static website and is not needed for simply allowing read access to display the website.  The requirement is for GetObject (read) access. "
    },
    {
        "number": 70,
        "title": "Automated Ticketing for VPN",
        "scenario": "A company has internal hybrid applications that have resources in the AWS Cloud and on premises.  Users report that the applications sometimes are not available.  The company has configured an Amazon CloudWatch alarm to monitor the tunnel status of its AWS Site-to-Site VPN connection.  A SysOps administrator must implement a solution that creates a high-priority ticket in an internal ticketing tool when the VPN tunnel is down. ",
        "questionText": "Which solution will meet this requirement? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create an Amazon Simple Notification Service (Amazon SNS) topic for the CloudWatch alarm. Subscribe the ticketing tool's endpoint to the SNS topic. "
            },
            {
                "letter": "B",
                "text": "Create an Amazon Simple Queue Service (Amazon SQS) queue as the target for the CloudWatch alarm. Configure the queue to transform messages into tickets and to post the tickets to the ticketing tool's endpoint. "
            },
            {
                "letter": "C",
                "text": "Create an AWS Lambda function. Configure the CloudWatch alarm to directly invoke the Lambda function to create individual tickets in the ticketing tool. "
            },
            {
                "letter": "D",
                "text": "Create an Amazon EventBridge rule that monitors the VPN tunnel directly. Configure the ticketing tool's endpoint as the target of the rule. "
            }
        ],
        "correctAnswers": [
            "C"
        ],
        "explanation": "Why C is correct: An AWS Lambda function provides the most flexibility and operational efficiency for integrating with a custom internal ticketing tool.  When a CloudWatch alarm enters an ALARM state, it can directly invoke a Lambda function.  This Lambda function can then contain custom logic to parse the alarm notification and make an API call or perform other actions specific to the internal ticketing tool to create a high-priority ticket.  This method is highly adaptable, as the Lambda function can be programmed to handle various integration complexities and data transformations. ",
        "wrongExplanation": "Why A is incorrect: While SNS can send notifications, the direct subscription of a \"ticketing tool's endpoint\" to an SNS topic usually implies that the ticketing tool can natively consume SNS messages (e.g., via HTTP/S endpoint or email).  This is not always guaranteed for arbitrary internal ticketing systems without some form of intermediary processing.  If the ticketing tool doesn't natively support SNS messages, then SNS alone is insufficient. \nWhy B is incorrect: SQS is a messaging queue, primarily for decoupling and buffering.  While a queue could receive the alarm message, a separate process or function would still be needed to poll the queue, transform the message, and create the ticket.  This adds more components than directly invoking Lambda from the alarm. \nWhy D is incorrect: While EventBridge can monitor AWS events (including CloudWatch alarm state changes), configuring the ticketing tool's endpoint directly as a target is similar to SNS, implying native integration, which is often not the case for internal tools without custom processing.  Lambda provides the necessary custom integration logic. "
    },
    {
        "number": 71,
        "title": "CloudFormation Failure and Rollback",
        "scenario": "A SysOps administrator is troubleshooting an AWS CloudFormation stack creation that failed.  Before the SysOps administrator can identify the problem, the stack and its resources are deleted.  For future deployments, the SysOps administrator must preserve any resources that CloudFormation successfully created. ",
        "questionText": "What should the SysOps administrator do to meet this requirement? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Set the value of the DisableRollback parameter to False during stack creation "
            },
            {
                "letter": "B",
                "text": "Set the value of the OnFailure parameter to DO_NOTHING during stack creation "
            },
            {
                "letter": "C",
                "text": "Specify a rollback configuration that has a rollback trigger of DO_NOTHING during stack creation "
            },
            {
                "letter": "D",
                "text": "Set the value of the OnFailure parameter to ROLLBACK during stack creation "
            }
        ],
        "correctAnswers": [
            "B"
        ],
        "explanation": "Why B is correct: When creating or updating a CloudFormation stack, you can use the OnFailure parameter (or --on-failure CLI option).  Setting this parameter to DO_NOTHING specifies that if a stack operation fails, CloudFormation should stop the operation and leave the successfully provisioned resources in their current state, rather than attempting to roll back the stack.  This allows the SysOps administrator to inspect the resources and troubleshoot the issue. ",
        "wrongExplanation": "Why A is incorrect: DisableRollback set to False (which is the default behavior if not specified) means that rollback is enabled, and upon failure, CloudFormation will attempt to roll back the stack and delete resources.  To preserve resources, you want to prevent rollback. \nWhy C is incorrect: Rollback triggers are used to initiate a rollback based on specific CloudWatch alarms.  While DO_NOTHING might be part of some configurations, the primary mechanism to control the overall failure behavior of the stack itself is the OnFailure parameter, not a rollback trigger. \nWhy D is incorrect: Setting OnFailure to ROLLBACK (which is the default behavior) means that if the stack operation fails, CloudFormation will attempt to roll back the stack and delete any resources that were successfully created, which is the opposite of the requirement. "
    },
    {
        "number": 72,
        "title": "EC2 Instance Bootstrapping",
        "scenario": "A company needs to implement a solution to install specific software on Amazon EC2 instances when the instances launch. ",
        "questionText": "Which solution will meet this requirement? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Configure AWS Systems Manager State Manager associations to bootstrap the EC2 instances with the required software at launch. "
            },
            {
                "letter": "B",
                "text": "Use the Amazon CloudWatch agent to detect EC2 InstanceStart events and to inject the required software. Modify the InstanceRole IAM role to add permissions for the StartTask API operation. "
            },
            {
                "letter": "C",
                "text": "Use Amazon Inspector to detect EC2 launch events. Configure Amazon Inspector to install the required software as part of lifecycle hooks for the EC2 launch events. "
            },
            {
                "letter": "D",
                "text": "Use AWS Security Hub remediation actions to install the required software at launch. "
            }
        ],
        "correctAnswers": [
            "A"
        ],
        "explanation": "Why A is correct: AWS Systems Manager State Manager allows you to define and maintain a consistent state for your EC2 instances.  You can create \"associations\" that specify a desired configuration, such as installing specific software.  These associations can be applied to instances at launch (or on a schedule), making it an effective and automated way to bootstrap EC2 instances with required software. ",
        "wrongExplanation": "Why B is incorrect: The CloudWatch agent is for collecting metrics and logs, not for deploying or installing software.  InstanceStart events can be used with EventBridge and Lambda to trigger actions, but the agent itself doesn't \"inject\" software. \nWhy C is incorrect: Amazon Inspector is a security assessment service that helps improve the security and compliance of applications deployed on AWS.  It assesses vulnerabilities and deviations from best practices but does not install software as part of lifecycle hooks. \nWhy D is incorrect: AWS Security Hub is a service that provides a comprehensive view of your security state within AWS.  While it offers remediation actions, these are typically for addressing security findings, not for initial software installation as part of a routine launch process. "
    },
    {
        "number": 73,
        "title": "EKS Anomaly Detection",
        "scenario": "A company is using Amazon CloudWatch alarms to monitor Amazon Elastic Kubernetes Service (Amazon EKS) workloads.  The alarms are initiated through a threshold definition and are not helping the EKS cluster operate more efficiently.  A SysOps administrator must implement a solution that identifies anomalies and generates recommendations for how to address the anomalies. ",
        "questionText": "Which solution will meet these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Use CloudWatch anomaly detection to identify anomalies and provide recommendations "
            },
            {
                "letter": "B",
                "text": "Use CloudWatch Container Insights with Amazon DevOps Guru to identify anomalies and provide recommendations. "
            },
            {
                "letter": "C",
                "text": "Use CloudWatch Container Insights to identify anomalies and provide recommendations "
            },
            {
                "letter": "D",
                "text": "Use CloudWatch anomaly detection with CloudWatch Container Insights to identify anomalies and provide recommendations "
            }
        ],
        "correctAnswers": [
            "B"
        ],
        "explanation": "Why B is correct: This option combines two powerful services for EKS monitoring and anomaly detection.  CloudWatch Container Insights is specifically designed to collect, aggregate, and summarize metrics and logs from containerized applications, including EKS.  Amazon DevOps Guru is a machine learning-powered service that automatically identifies operational issues and recommends specific actions to improve application availability and resolve problems.  By leveraging Container Insights for detailed EKS metrics and logs, and then feeding that data into DevOps Guru, you gain the ability to automatically identify anomalies and receive actionable recommendations. ",
        "wrongExplanation": "Why A is incorrect: While CloudWatch anomaly detection can identify deviations from normal patterns, it doesn't generate recommendations for how to address them; it only flags the anomaly. \nWhy C is incorrect: CloudWatch Container Insights provides detailed metrics and insights for EKS workloads, which can help in identifying issues.  However, it does not inherently generate recommendations for resolving anomalies; that's where a service like DevOps Guru comes in. \nWhy D is incorrect: While using CloudWatch anomaly detection with Container Insights would certainly help identify anomalies, it still lacks the automatic recommendation generation feature that DevOps Guru provides.  The question specifically asks for a solution that \"generates recommendations. "
    },
    {
        "number": 74,
        "title": "DynamoDB Deletion Protection",
        "scenario": "A company has an application that uses Amazon DynamoDB tables. The tables are spread across AWS accounts and AWS Regions. The company uses AWS CloudFormation to deploy AWS resources. A new team at the company is deleting unused AWS resources. The team accidentally deletes several production DynamoDB tables by running an AWS Lambda function that makes a DynamoDB Delete Table API call. The table deletions cause an application outage. A SysOps administrator must implement a solution that minimizes the chance of accidental deletions of tables. The solution also must minimize data loss that results from accidental deletions. ",
        "questionText": "Which combination of steps will meet these requirements? (CHOOSE TWO.) ",
        "isMultiChoice": true,
        "options": [
            {
                "letter": "A",
                "text": "Enable termination protection for the CloudFormation stacks that deploy the DynamoDB tables. "
            },
            {
                "letter": "B",
                "text": "Enable deletion protection for the DynamoDB tables. "
            },
            {
                "letter": "C",
                "text": "Enable point-in-time recovery for the DynamoDB tables. Restore the tables if they are accidentally deleted. "
            },
            {
                "letter": "D",
                "text": "Schedule daily backups of the DynamoDB tables. Restore the tables if they are accidentally deleted. "
            },
            {
                "letter": "E",
                "text": "Export the DynamoDB tables to Amazon S3 every day. Use Import from Amazon S3 to restore data for tables that are accidentally deleted. "
            }
        ],
        "correctAnswers": [
            "B",
            "C"
        ],
        "explanation": "Why B is correct: DynamoDB now offers a \"deletion protection\" feature.  When enabled for a table, it prevents the table from being accidentally deleted.  This directly addresses the requirement to \"minimize the chance of accidental deletions of tables.\" \nWhy C is correct: Amazon DynamoDB Point-in-Time Recovery (PITR) provides continuous backups of your table data.  It enables you to restore a table to any point in time during the last 35 days, with second-level granularity.  This significantly minimizes data loss from accidental deletions, as you can recover the table to the exact moment before it was deleted. ",
        "wrongExplanation": "Why A is incorrect: While CloudFormation stack termination protection prevents the stack from being deleted, it does not directly prevent a Delete Table API call made outside of CloudFormation (e.g., by a Lambda function) from deleting the DynamoDB table itself.  DynamoDB's native deletion protection is more direct for table protection.  Also, termination protection often only applies to new stacks, and the question mentions existing tables. \nWhy D is incorrect: Daily backups would reduce data loss, but PITR (Option C) offers continuous backups with second-level granularity for up to 35 days, making it superior for minimizing data loss in this scenario. \nWhy E is incorrect: Exporting to S3 and then importing back is a more manual and time-consuming process for recovery compared to DynamoDB's built-in PITR, which is designed for quick and granular recovery. "
    },
    {
        "number": 75,
        "title": "AMI Compliance Automation",
        "scenario": "A company has a list of pre-approved Amazon Machine Images (AMIs) for developers to use to launch Amazon EC2 instances.  However, developers are still launching EC2 instances from unapproved AMIs.  A SysOps administrator must implement a solution that automatically terminates any instances that are launched from unapproved AMIs. ",
        "questionText": "Which solution will meet this requirement? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Set up an AWS Config managed rule to check if instances are running from AMIs that are on the list of pre-approved AMIs. Configure an automatic remediation action so that an AWS Systems Manager Automation runbook terminates any instances that are noncompliant with the rule. "
            },
            {
                "letter": "B",
                "text": "Store the list of pre-approved AMIs in an Amazon DynamoDB global table that is replicated to all AWS Regions that the developers use. Create Regional EC2 launch templates. Configure the launch templates to check AMIs against the list and to terminate any instances that are not on the list. "
            },
            {
                "letter": "C",
                "text": "Select the Amazon CloudWatch metric that shows all running instances and the AMIs that the instances were launched from. Create a CloudWatch alarm that terminates an instance if the metric shows the use of an unapproved AMI. "
            },
            {
                "letter": "D",
                "text": "Create a custom Amazon Inspector finding to compare a running instance's AMI against the list of pre-approved AMIS. Create an AWS Lambda function that terminates instances. Configure Amazon Inspector to report findings of unapproved AMIs to an Amazon Simple Queue Service (Amazon SQS) queue to invoke the Lambda function. "
            }
        ],
        "correctAnswers": [
            "A"
        ],
        "explanation": "Why A is correct: AWS Config is designed for continuously monitoring and enforcing compliance of AWS resources.  You can use an AWS Config managed rule (or a custom rule if needed) to evaluate whether EC2 instances are launched from approved AMIs.  If an instance is found to be non-compliant, AWS Config can trigger an automatic remediation action using an AWS Systems Manager Automation document.  This Automation document can then execute steps, such as terminating the non-compliant EC2 instance.  This provides an automated, scalable, and operationally efficient solution for enforcing the AMI policy. ",
        "wrongExplanation": "Why B is incorrect: EC2 Launch Templates do not have built-in logic to \"check AMIs against a list and terminate instances.\"  They define the parameters for launching instances but don't enforce post-launch compliance or termination in this manner. \nWhy C is incorrect: CloudWatch metrics primarily provide numerical data.  While you can get instance-related metrics, there isn't a direct CloudWatch metric that exposes the AMI ID in a way that allows for easy alarming and automatic termination based on an \"unapproved\" list.  This would likely require complex custom metrics or log analysis, which is less direct than AWS Config. \nWhy D is incorrect: While Amazon Inspector can identify security findings, creating a \"custom Amazon Inspector finding\" for unapproved AMIs and then setting up an SQS queue and Lambda for termination is a more complex and less direct approach compared to the native compliance and remediation capabilities offered by AWS Config.  AWS Config is purpose-built for this type of policy enforcement. "
    },
    {
        "number": 76,
        "title": "IAM Access Key Rotation",
        "scenario": "A company is using AWS to deploy a critical application on a fleet of Amazon EC2 instances.  The company is rewriting the application because the application failed a security review.  The application will take 12 months to rewrite. While this rewrite happens, the company needs to rotate IAM access keys that the application uses.  A SysOps administrator must implement an automated solution that finds and rotates IAM access keys that are at least 30 days old.  The solution must then continue to rotate the IAM access keys every 30 days. ",
        "questionText": "Which solution will meet this requirement with the MOST operational efficiency? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Use an AWS Config rule to identify IAM access keys that are at least 30 days old. Configure AWS Config to invoke an AWS Systems Manager Automation runbook to rotate the identified IAM access keys. "
            },
            {
                "letter": "B",
                "text": "Use AWS Trusted Advisor to identify IAM access keys that are at least 30 days old. Configure Trusted Advisor to invoke an AWS Systems Manager Automation runbook to rotate the identified IAM access keys. "
            },
            {
                "letter": "C",
                "text": "Create a script that checks the age of IAM access keys and rotates them if they are at least 30 days old. Launch an EC2 instance. Schedule the script to run as a cron expression on the EC2 instance every day. "
            },
            {
                "letter": "D",
                "text": "Create an AWS Lambda function that checks the age of IAM access keys and rotates them if they are at least 30 days old. Use an Amazon EventBridge rule to invoke the Lambda function every time a new IAM access key is created. "
            }
        ],
        "correctAnswers": [
            "A"
        ],
        "explanation": "Why A is correct: AWS Config provides continuous monitoring of resource configurations and can be used to evaluate the age of IAM access keys against a specified rule (e.g., maximum age of 30 days).  When a key is identified as non-compliant (older than 30 days), AWS Config can trigger an automatic remediation action.  This remediation action can be an AWS Systems Manager Automation runbook, which can be designed to perform the actual rotation of the IAM access keys.  This approach is highly automated, scalable, and follows AWS best practices for operational efficiency by using managed services for compliance and automation. ",
        "wrongExplanation": "Why B is incorrect: While AWS Trusted Advisor has a check for \"IAM Access Key Usage,\" its primary role is to provide recommendations for cost optimization, security, performance, etc. It is not designed to automatically invoke remediation actions like rotating keys based on its findings.  It's more of an advisory service. \nWhy C is incorrect: This solution involves provisioning and managing an EC2 instance just to run a cron job, which introduces operational overhead (e.g., patching, security, high availability of the EC2 instance).  AWS managed services like Config and Systems Manager are more serverless and operationally efficient for this task. \nWhy D is incorrect: An EventBridge rule invoked every time a new IAM access key is created would not directly address the need to find and rotate keys that are at least 30 days old on a continuous basis.  While a Lambda function could perform the rotation, the trigger mechanism needs to be time-based (e.g., a scheduled EventBridge rule or AWS Config's continuous evaluation), not just new key creation. "
    },
    {
        "number": 77,
        "title": "IAM Policy JSON Structure",
        "scenario": "The Statement element, of an AWS IAM policy, contains an array of individual statements. ",
        "questionText": "The Statement element, of an AWS IAM policy, contains an array of individual statements. Each individual statement is a(n) ___ in braces {}. ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "JSON "
            },
            {
                "letter": "B",
                "text": "AJAX "
            },
            {
                "letter": "C",
                "text": "JavaScript "
            },
            {
                "letter": "D",
                "text": "jQuery "
            }
        ],
        "correctAnswers": [
            "A"
        ],
        "explanation": "AWS IAM policies are written in JSON (JavaScript Object Notation).  A Statement element within an IAM policy contains an array of individual policy statements, and each individual statement is a JSON block enclosed in braces {}. ",
        "wrongExplanation": ""
    },
    {
        "number": 78,
        "title": "Single-Page App Monitoring",
        "scenario": "A company runs a single-page web application on AWS. The application uses Amazon CloudFront to deliver static content from an Amazon S3 bucket origin.  The application also uses an Amazon Elastic Kubernetes Service (Amazon EKS) cluster to serve API calls.  Users sometimes report that the website is not operational, even when monitoring shows that the index page is reachable and that the EKS cluster is healthy.  A SysOps administrator must implement additional monitoring that can detect when the website is not operational before users report the problem. ",
        "questionText": "Which solution will meet these requirements? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Create an Amazon CloudWatch Synthetics heartbeat monitor canary that points to the fully qualified domain name (FQDN) of the website. "
            },
            {
                "letter": "B",
                "text": "Create an Amazon CloudWatch Synthetics API canary that monitors the availability of API endpoints from the EKS cluster. "
            },
            {
                "letter": "C",
                "text": "Create an Amazon CloudWatch RUM app monitor that points to the fully qualified domain name (FQDN) of the website. Configure the app monitor to collect performance telemetry and JavaScript errors. "
            },
            {
                "letter": "D",
                "text": "Create an Amazon CloudWatch RUM app monitor that uses the API endpoints from the EKS cluster. "
            }
        ],
        "correctAnswers": [
            "A"
        ],
        "explanation": "Why A is correct: The key problem is that \"the website is not operational, even when monitoring shows that the index page is reachable and that the EKS cluster is healthy.\"  This suggests an issue with the end-to-end user experience, where individual components might be up, but the overall application flow is broken.  An Amazon CloudWatch Synthetics \"heartbeat monitor canary\" simulates a user's interaction by loading the specified website URL (FQDN).  This type of canary tests the entire front-end application stack, including CloudFront, S3, and the initial loading of the page.  It provides a proactive, external check of the website's availability from an end-user perspective, detecting issues before users report them. ",
        "wrongExplanation": "Why B is incorrect: An API canary would only test the EKS API endpoints.  While important, the problem statement indicates the EKS cluster is healthy, so a dedicated API canary alone wouldn't capture the \"website not operational\" issue, which is broader than just API availability. \nWhy C and D are incorrect: Amazon CloudWatch RUM (Real User Monitoring) collects data from actual user sessions.  While valuable for understanding real user experience, the requirement is to \"detect when the website is not operational before users report the problem.\"  Synthetics (canaries) are proactive and run continually, whereas RUM is reactive to actual user traffic. "
    },
    {
        "number": 79,
        "title": "Inline Threat Protection",
        "scenario": "You have been asked to design a layered security solution for protecting your organization's network infrastructure.  You research several options and decide to deploy a network-level security control appliance, inline, where traffic is intercepted and analyzed prior to being forwarded to its final destination, such as an application server. ",
        "questionText": "Which of the following is NOT considered an inline threat protection technology? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Intrusion prevention systems "
            },
            {
                "letter": "B",
                "text": "Third-party firewall devices installed on Amazon EC2 instances "
            },
            {
                "letter": "C",
                "text": "Data loss management gateways "
            },
            {
                "letter": "D",
                "text": "Augmented security groups with Network ACLS "
            }
        ],
        "correctAnswers": [
            "D"
        ],
        "explanation": "Why D is correct: Inline threat protection technologies intercept and analyze traffic before forwarding it, actively blocking or preventing threats.  Security Groups and Network ACLS (NACLS) are fundamental network-level security controls in AWS, but they operate as stateless (NACLS) or stateful (Security Groups) packet filters that allow or deny traffic based on rules (IP addresses, ports, protocols).  They do not perform deep packet inspection or active analysis to detect and prevent complex threats in an \"inline\" fashion like the other options.  They are foundational network segmentation and access control mechanisms, not typically classified as inline threat protection appliances. ",
        "wrongExplanation": "Why A, B, and C are incorrect: These are all examples of inline threat protection technologies. \nIntrusion Prevention Systems (IPS): Actively monitor network or system activities for malicious or unwanted behavior and can take action to block or prevent such activities.  They operate inline. \nThird-party firewall devices installed on Amazon EC2 instances: These are \"soft blades\" or virtual network appliances that can perform deep packet inspection, application-layer filtering, and threat prevention, operating inline with traffic flows. \nData loss management (DLP) gateways: Intercept traffic to inspect for sensitive data and prevent its exfiltration, thus operating inline. "
    },
    {
        "number": 80,
        "title": "MySQL SSL Encryption",
        "scenario": "",
        "questionText": "Is it possible to protect the connections between your application servers and your MySQL instances using SSL encryption? ",
        "isMultiChoice": false,
        "options": [
            {
                "letter": "A",
                "text": "Yes, it is possible but only in certain regions. "
            },
            {
                "letter": "B",
                "text": "Yes"
            },
            {
                "letter": "C",
                "text": "No "
            },
            {
                "letter": "D",
                "text": "Yes, it is possible but only in VPC. "
            }
        ],
        "correctAnswers": [
            "B"
        ],
        "explanation": "Why B is correct: Yes, it is definitely possible to protect connections between application servers and MySQL instances using SSL (now commonly referred to as TLS/SSL) encryption.  This is a standard security practice for database connections, regardless of whether the instances are in AWS, on-premises, or in a hybrid environment.  AWS database services like Amazon RDS for MySQL strongly support and recommend SSL/TLS for secure communication. ",
        "wrongExplanation": "It is not limited to specific regions or VPCs. "
    }
]
