const cookie_name = "json2";
const main_title = "AWS SysOps Practice Hard Quizzes";
 // --- DATA SOURCE ---
const questions = [
    {
      "number": 1,
      "title": "VPC Endpoint Policy for Cross-Account S3 Access",
      "scenario": "A central 'logging' account (111111111111) has an S3 bucket that receives logs from various applications running in a 'production' account (999999999999). The production account's VPC is connected to S3 using an S3 Gateway VPC Endpoint. A strict security policy must be enforced: only a specific IAM role (`arn:aws:iam::999999999999:role/AppRole`) from the production account should be able to put objects into the logging bucket, and this action must originate from within the production VPC. The S3 bucket policy in the logging account correctly grants `s3:PutObject` to this `AppRole`, and the VPC endpoint policy needs to be configured to further lock this down.",
      "questionText": "Given the existing S3 bucket policy already grants the necessary permissions, which VPC Endpoint policy should be attached to the S3 Gateway Endpoint in the production account to enforce this security requirement most effectively without breaking other necessary S3 access for different roles and buckets?",
      "isMultiChoice": false,
      "options": [
        {
          "letter": "A",
          "text": "A policy with 'Effect': 'Allow', 'Principal': '*', 'Action': 's3:PutObject', 'Resource': 'arn:aws:s3:::logging-bucket/*', 'Condition': { 'StringEquals': { 'aws:sourceVpc': 'vpc-123abcde' } }"
        },
        {
          "letter": "B",
          "text": "A policy with 'Effect': 'Deny', 'Principal': '*', 'Action': 's3:PutObject', 'Resource': 'arn:aws:s3:::logging-bucket/*', 'Condition': { 'StringNotEquals': { 'aws:principalArn': 'arn:aws:iam::999999999999:role/AppRole' } }"
        },
        {
          "letter": "C",
          "text": "A policy with 'Effect': 'Allow', 'Principal': { 'AWS': 'arn:aws:iam::999999999999:role/AppRole' }, 'Action': 's3:PutObject', 'Resource': 'arn:aws:s3:::logging-bucket/*'"
        },
        {
          "letter": "D",
          "text": "A policy with 'Effect': 'Deny', 'Principal': '*', 'Action': 's3:*', 'Resource': '*', 'Condition': { 'ArnNotEquals': { 'aws:principalArn': 'arn:aws:iam::999999999999:role/AppRole' } }"
        }
      ],
      "correctAnswers": [
        "B"
      ],
      "explanation": "Why B is correct: VPC Endpoint policies act as an additional layer of access control that is evaluated alongside IAM policies and resource-based policies. An explicit 'Deny' policy is the most powerful tool for creating security guardrails because it cannot be overridden by an 'Allow'. This policy explicitly denies the `s3:PutObject` action to the specific logging bucket for any principal *except* the allowed `AppRole`. Since this policy is attached to the endpoint, it enforces that any traffic passing through the endpoint to that bucket must originate from the approved role, effectively creating a secure channel. This is the most secure approach as it broadly denies access to the specific resource and then makes a narrow exception.",
      "wrongExplanation": "Why the others are wrong: \nA: An 'Allow' policy on its own doesn't prevent other roles or users (who might have IAM permissions) from using the endpoint to access the bucket. An explicit 'Deny' is needed to override other potential permissions. \nC: This 'Allow' policy is redundant if the IAM role already has permission from its own policy and the bucket policy. It doesn't prevent other principals from accessing the bucket if they have separate IAM permissions. The goal is to restrict access *at the endpoint level*. \nD: This policy is far too broad and is a dangerous configuration. It denies all S3 actions to all S3 resources for everyone except the `AppRole`, which would almost certainly break other legitimate and necessary S3 access needed by other applications or users within the VPC."
    },
    {
      "number": 2,
      "title": "VPC Interface Endpoint DNS Resolution in Hybrid Scenarios",
      "scenario": "A company has a hybrid cloud setup with an on-premises data center connected to an AWS VPC via Direct Connect. Inside the VPC, they use an Interface VPC Endpoint for AWS Systems Manager (SSM) API calls (`ssm.us-east-1.amazonaws.com`), and they have enabled the 'private DNS names' feature on the endpoint. The VPC itself has 'DNS hostnames' and 'DNS support' enabled. On-premises servers need to resolve the public SSM DNS name to the private IP addresses of the endpoint ENIs to securely send commands over the private connection. The on-premises DNS servers are configured to forward requests for the `amazonaws.com` domain to the Amazon-provided DNS resolver for the VPC (at the x.x.x.2 address).",
      "questionText": "When an on-premises server attempts to perform a DNS query for `ssm.us-east-1.amazonaws.com`, what is the expected outcome given this configuration, and what must be done to make it work?",
      "isMultiChoice": false,
      "options": [
        {
          "letter": "A",
          "text": "The request fails because the VPC's default DNS resolver will not respond to queries from on-premises IP addresses."
        },
        {
          "letter": "B",
          "text": "The request succeeds, and the VPC's default DNS resolver returns the public IP addresses for the SSM service because the query originates from outside the VPC."
        },
        {
          "letter": "C",
          "text": "The request succeeds, and the VPC's default DNS resolver correctly returns the private IP addresses of the Interface Endpoint's ENIs because of the forwarding rule."
        },
        {
          "letter": "D",
          "text": "The request must be sent to a Route 53 Resolver Inbound Endpoint, which is specifically designed to handle DNS queries from on-premises networks for private resources."
        }
      ],
      "correctAnswers": [
        "D"
      ],
      "explanation": "Why D is correct: The Amazon-provided DNS resolver at the `.2` address of a VPC is a fundamental VPC construct that is only accessible from within that VPC's network boundaries. It will not respond to queries that originate from an on-premises network over a Direct Connect or VPN connection. To enable hybrid DNS resolution for private endpoints, the correct and purpose-built architecture is to use Amazon Route 53 Resolver. An Inbound Endpoint must be created in the VPC, which provisions ENIs with IP addresses that *are* reachable from the on-premises network. The on-premises DNS servers should then be configured to conditionally forward queries for `*.amazonaws.com` to the IP addresses of this Inbound Endpoint, which can then correctly resolve the private IPs of the interface endpoint.",
      "wrongExplanation": "Why the others are wrong: \nA: This statement correctly identifies the problem (the default resolver won't respond) but fails to provide the solution, making it an incomplete answer. A professional-level question expects the solution. \nB: This is incorrect for two reasons. First, the default resolver will not respond to the query. Second, even if it did, the private DNS feature on the interface endpoint ensures that queries from within its sphere of influence resolve to private, not public, IPs. \nC: This is the desired outcome but describes a mechanism that does not work. The forwarding rule to the default `.2` resolver is the critical flaw in the described architecture."
    },
    {
      "number": 3,
      "title": "AWS Site-to-Site VPN with BGP AS-PATH Prepending",
      "scenario": "A company has established a highly available connection to their VPC using two separate Site-to-Site VPN connections from two different on-premises locations (Location A and Location B) to a single Transit Gateway. Both VPN connections use BGP for dynamic routing, and both advertise the same on-premises CIDR block (e.g., 10.0.0.0/16). The primary goal is to have all traffic from the VPC to the on-premises network prefer the route through Location A. Location B should only be used as a backup if the BGP session to Location A fails, ensuring a robust failover mechanism.",
      "questionText": "Considering the AWS BGP path selection algorithm for inbound routes to the Transit Gateway, how should the on-premises BGP routers be configured to ensure the VPC always prefers the path through Location A when it is available?",
      "isMultiChoice": false,
      "options": [
        {
          "letter": "A",
          "text": "On the Location A router, advertise the 10.0.0.0/16 route with a higher BGP Local Preference value to ensure the Transit Gateway prefers it."
        },
        {
          "letter": "B",
          "text": "On the Location B router, use AS-PATH prepending to artificially lengthen the Autonomous System path for the 10.0.0.0/16 route it advertises."
        },
        {
          "letter": "C",
          "text": "On the Transit Gateway's route table, create a static route for 10.0.0.0/16 that points to the VPN attachment for Location A, which will be preferred over BGP."
        },
        {
          "letter": "D",
          "text": "On the Location A router, advertise the 10.0.0.0/16 route with a lower MED (Multi-Exit Discriminator) value than the route advertised from Location B."
        }
      ],
      "correctAnswers": [
        "B"
      ],
      "explanation": "Why B is correct: When an AWS Transit Gateway or Virtual Private Gateway receives multiple BGP routes for the same destination prefix, it uses a specific path selection algorithm to determine the best path. One of the most influential and commonly used attributes to control this inbound path selection is the AS_PATH length. The path with the shortest AS_PATH is strongly preferred. By prepending its own Autonomous System Number (ASN) multiple times to the routes advertised from the backup location (Location B), the on-premises network makes the path through Location B seem less desirable to AWS. The Transit Gateway will see the shorter, non-prepended AS_PATH from Location A and will install that route as the primary path in its route table.",
      "wrongExplanation": "Why the others are wrong: \nA: BGP Local Preference is an attribute used by a BGP speaker to inform its internal peers about the preferred exit point from its own AS. The on-premises router cannot set the Local Preference value that the Transit Gateway will use internally; this attribute is not sent between external BGP peers. \nC: Using static routes on the Transit Gateway would work, but it completely defeats the purpose of using BGP for dynamic routing and automatic failover. If the Location A VPN fails, the static route would remain, and traffic would be black-holed until a manual intervention occurs. \nD: While MED is a valid BGP attribute used to influence path selection, the AWS path selection algorithm evaluates the AS_PATH length *before* it evaluates the MED value. Therefore, manipulating the AS_PATH is the more direct, conventional, and reliable method to achieve the desired active/passive outcome."
    },
    {
      "number": 4,
      "title": "Troubleshooting Asymmetric AWS VPN Tunnel Failure",
      "scenario": "An engineer has set up a new AWS Site-to-Site VPN connection between an on-premises firewall and a Transit Gateway. The connection has two tunnels for high availability. After configuration, Tunnel 1 comes up successfully, BGP establishes, and traffic flows correctly. However, Tunnel 2 remains in a 'DOWN' state, and the BGP status for it is stuck in 'Idle'. The engineer has meticulously confirmed that the pre-shared keys and all IKE/IPsec encryption parameters are identical for both tunnels on both the AWS side and the on-premises firewall. The firewall logs indicate that it is sending IKE initiation packets (ISAKMP) for Tunnel 2, but it is not receiving any response from the AWS endpoint.",
      "questionText": "Given that Tunnel 1 is fully functional and encryption settings are confirmed to be correct, which two of the following are the most likely causes for only Tunnel 2 failing to establish the IKE security association?",
      "isMultiChoice": true,
      "options": [
        {
          "letter": "A",
          "text": "The on-premises firewall's access control list (ACL) or security policy is blocking outbound UDP port 500 traffic specifically destined for the public IP address of the AWS endpoint for Tunnel 2."
        },
        {
          "letter": "B",
          "text": "The 'Inside IP CIDR' for Tunnel 2 on the AWS side has been configured with an IP range that overlaps with an existing CIDR in one of the VPCs attached to the Transit Gateway."
        },
        {
          "letter": "C",
          "text": "The AWS Security Group associated with the Transit Gateway's VPC attachment is not allowing inbound UDP port 500 traffic from the on-premises firewall's public IP address."
        },
        {
          "letter": "D",
          "text": "An intermediate router or firewall between the on-premises data center and the internet is performing Network Address Translation (NAT) incorrectly, causing the IKE packets for Tunnel 2 to be altered or dropped while allowing packets for Tunnel 1 to pass."
        },
        {
          "letter": "E",
          "text": "The public IP address of the on-premises firewall is not correctly specified in the Customer Gateway configuration object within AWS, causing a mismatch during peer validation for Tunnel 2."
        }
      ],
      "correctAnswers": [
        "A",
        "D"
      ],
      "explanation": "Why A and D are correct: \nA: Each AWS VPN tunnel has a unique public IP address on the AWS side, even though they are part of the same VPN connection. A very common configuration error is for a firewall ACL to be written to only allow traffic to and from the public IP of the first tunnel, inadvertently blocking the IKE negotiation (which happens over UDP port 500) for the second tunnel's unique endpoint IP. This perfectly explains the asymmetric failure. \nD: IKE negotiations are sensitive to Network Address Translation (NAT). If there is a NAT device (like a border router or firewall) between the on-premises Customer Gateway and the AWS endpoint, NAT-Traversal (NAT-T) must be used, which encapsulates IPsec packets in UDP on port 4500. A misconfigured or incompatible intermediate router could easily disrupt the IKE exchange for one tunnel while allowing the other, especially if the paths taken over the internet are different or if stateful session handling fails for the second negotiation.",
      "wrongExplanation": "Why the others are wrong: \nB: The Inside IP CIDR is used for the tunnel interface addressing for BGP peering. An IP overlap might cause routing issues or BGP establishment problems *after* the tunnel is already up, but it would not prevent the underlying Phase 1 IKE negotiation from completing and the tunnel status itself from becoming 'UP'. \nC: Transit Gateway VPN attachments do not have Security Groups directly associated with them. Security Groups are stateful firewalls that operate at the ENI level (e.g., for EC2 instances, Lambda functions, or Interface Endpoints), not at the TGW attachment level. \nE: The Customer Gateway object in AWS uses a single public IP address for the on-premises peer. If this IP were wrong, it is extremely unlikely that Tunnel 1 would have established successfully, as AWS would not be able to validate the source of the IKE negotiation from the on-premises device."
    },
    {
      "number": 5,
      "title": "Direct Connect Active/Active with Local Preference",
      "scenario": "A company requires a highly available and high-bandwidth connection to AWS from their on-premises data center. They have provisioned two separate 10 Gbps Direct Connect connections at two different Direct Connect locations (Location A and Location B). Each connection terminates on a different on-premises router, and both connections are configured with private VIFs to a single Direct Connect Gateway. This DXGW is, in turn, attached to a Transit Gateway that handles routing for multiple VPCs. The primary business requirement is to load-balance egress traffic from AWS across both 10 Gbps connections to achieve a 20 Gbps aggregate bandwidth (active/active).",
      "questionText": "To influence the AWS-to-on-premises traffic flow, which two BGP configurations should be implemented on the on-premises routers to achieve an active/active, load-balanced egress pattern from AWS?",
      "isMultiChoice": true,
      "options": [
        {
          "letter": "A",
          "text": "From both on-premises routers (Location A and B), advertise the same destination prefixes to AWS."
        },
        {
          "letter": "B",
          "text": "From both on-premises routers, ensure the AS-PATH length for the advertised prefixes is identical."
        },
        {
          "letter": "C",
          "text": "Configure the router at Location A to advertise routes with a higher BGP Local Preference value than the router at Location B."
        },
        {
          "letter": "D",
          "text": "Configure the router at Location A to advertise routes with a lower MED (Multi-Exit Discriminator) value than the router at Location B."
        },
        {
          "letter": "E",
          "text": "Configure the router at Location B to use AS-PATH prepending for its advertised prefixes to make it a backup path."
        }
      ],
      "correctAnswers": [
        "A",
        "B"
      ],
      "explanation": "Why A and B are correct: \nA & B: When a Direct Connect Gateway associated with a Transit Gateway receives multiple paths for the same prefix from the same customer ASN, it can perform Equal-Cost Multi-Path (ECMP) routing. For ECMP to be enabled, allowing AWS to load-balance traffic across the connections, the BGP paths must be identical from AWS's perspective. This means the advertised prefixes must be the same, and crucially, the AS_PATH length must be identical. If all other BGP attributes are also the same (which they will be by default), the Transit Gateway will load-balance traffic across the multiple paths provided by the two Direct Connect connections.",
      "wrongExplanation": "Why the others are wrong: \nC: BGP Local Preference is used to influence *outbound* traffic from within a single Autonomous System. It is not advertised to external peers like the AWS Direct Connect Gateway. Therefore, setting it on-premises has no effect on how AWS routes traffic back to the data center. \nD: MED (Multi-Exit Discriminator) is specifically used to signal a preference between multiple entry points into a single AS. Setting different MED values would cause AWS to prefer one path over the other (the one with the lower MED), resulting in an active/passive setup, not the desired active/active load-balancing. \nE: AS-PATH prepending is the standard mechanism to make one path intentionally longer and therefore less preferred. This is used to create an active/passive (failover) configuration, which is the opposite of the active/active goal."
    },
    {
      "number": 6,
      "title": "Direct Connect with Transit Gateway Inter-Region Peering",
      "scenario": "A global company has a primary data center in North America and has established a 10 Gbps Direct Connect connection to a Direct Connect Gateway (DXGW) in the `us-east-1` region. This DXGW is associated with a Transit Gateway (TGW-A) also in `us-east-1`. The company has a significant application presence in Europe, managed by a second Transit Gateway (TGW-B) in the `eu-west-1` region. TGW-A and TGW-B are connected via an inter-region peering attachment. An on-premises server with IP 10.10.1.5 needs to communicate with a critical application server in a VPC in Europe with IP 172.16.1.5. Routing on the on-premises router and within all TGW route tables has been configured to allow this traffic.",
      "questionText": "What is the expected behavior for traffic flowing from the on-premises server to the EC2 instance in `eu-west-1`, and what underlying principle of AWS networking enables this?",
      "isMultiChoice": false,
      "options": [
        {
          "letter": "A",
          "text": "Traffic flows successfully over the Direct Connect, through TGW-A, across the inter-region peering connection, to TGW-B, and then to the EC2 instance, leveraging the AWS global backbone for the inter-region transit."
        },
        {
          "letter": "B",
          "text": "The traffic is dropped at the Direct Connect Gateway because a DXGW can only be associated with Transit Gateways in its local region and cannot route to peered regions."
        },
        {
          "letter": "C",
          "text": "The traffic is dropped at TGW-A because routes learned from a Direct Connect Gateway attachment are considered local and are not propagated over a Transit Gateway peering connection by default."
        },
        {
          "letter": "D",
          "text": "The connection fails because for this architecture to work, the on-premises network must establish a second, separate Direct Connect connection directly to the `eu-west-1` region."
        }
      ],
      "correctAnswers": [
        "A"
      ],
      "explanation": "Why A is correct: This architecture represents a standard and powerful global transit network pattern on AWS. A Direct Connect Gateway is a global object that can be associated with Transit Gateways in any region (within its commercial partition, e.g., aws). The routes learned from the on-premises network via the DXGW are propagated to the associated Transit Gateway's route table (TGW-A). When TGW-A is peered with TGW-B, this routing information is propagated across the secure and high-bandwidth AWS global network via the peering connection to TGW-B's route table. This allows for seamless, private communication from an on-premises location connected in one region to VPCs in any other peered region.",
      "wrongExplanation": "Why the others are wrong: \nB: This statement is false. A key use case of a DXGW is to act as a regional ingress/egress point that can connect to a global network built with multiple Transit Gateways. \nC: This statement is false. By default, routes from all attachment types (VPC, VPN, DXGW) are propagated over a TGW peering connection to the peer TGW's route table, assuming the route table's propagation settings are enabled. This is fundamental to building a transit network. \nD: This is an inefficient and costly approach. The entire purpose of the Transit Gateway and Direct Connect Gateway combination is to avoid having to build full-mesh connectivity and to use the AWS backbone as the global transport network."
    },
    {
      "number": 7,
      "title": "AWS Budgets Action for Proactive Cost Control",
      "scenario": "A company wants to give its development team access to experiment with new services in a sandbox account, but needs to strictly control costs to prevent budget overruns. They have created a 'developer' IAM group that all developers use. The goal is to automatically and proactively restrict the developers' permissions if their spending for the month is forecasted to exceed $1000. When the forecast hits this threshold, a very restrictive, pre-defined IAM policy (`arn:aws:iam::123456789012:policy/dev-lockdown-policy`) should be attached to the 'developer' IAM group, effectively limiting them to read-only actions until a manager can review the spending.",
      "questionText": "Considering the need for a proactive, automated, and managed solution, how should AWS Budgets be configured to implement this forecast-based lockdown?",
      "isMultiChoice": false,
      "options": [
        {
          "letter": "A",
          "text": "Create a cost budget for $1000. Configure a budget alert to publish a message to an SNS topic when the forecasted budget reaches 100%. A subscribed Lambda function then programmatically attaches the IAM policy."
        },
        {
          "letter": "B",
          "text": "Create a cost budget for $1000. Configure a Budgets Action that is triggered when the 'Forecasted' spend is greater than 100% of the budgeted amount, and configure the action to attach the specified IAM policy directly to the target IAM group."
        },
        {
          "letter": "C",
          "text": "Create a cost budget for $1000. Configure a Budgets Action to trigger when 'Actual' spend is greater than 100% of the budget, and set the action to run an SSM Automation document that uses the AWS CLI to apply the policy."
        },
        {
          "letter": "D",
          "text": "Create a Savings Plans utilization budget for $1000. Configure a Budgets Action to apply the IAM policy if the calculated utilization percentage drops below a specified threshold, indicating a lack of usage."
        }
      ],
      "correctAnswers": [
        "B"
      ],
      "explanation": "Why B is correct: AWS Budgets Actions is a feature designed for exactly this type of proactive, automated cost control. It allows you to configure specific, managed actions to be taken when a budget threshold is breached. Crucially, the trigger can be set based on either 'Actual' or 'Forecasted' spend. By choosing 'Forecasted' spend, the action will be triggered *before* the money is actually spent, allowing for proactive intervention. The service provides a native, managed action to attach an IAM policy directly to a user or group, which eliminates the need to create and maintain custom solutions like Lambda functions or SSM documents for this common use case.",
      "wrongExplanation": "Why the others are wrong: \nA: While this architecture would work, it represents an older and more complex pattern. Budgets Actions provides a native, more secure, and more manageable way to achieve the same result without writing or maintaining custom Lambda code and the associated IAM permissions. \nC: This configuration is reactive, not proactive. It triggers the lockdown action only *after* the $1000 budget has already been exceeded, which fails to meet the core requirement to act based on a forecast to prevent the overrun. \nD: A Savings Plans utilization budget is the wrong tool for the job. It is used to monitor the usage of your purchased Savings Plans discounts, not to control the overall cost spending on AWS resources within an account. It measures commitment utilization, not total spend."
    },
    {
      "number": 8,
      "title": "Configuring a Multi-Dimensional AWS Cost Budget",
      "scenario": "An organization needs to track the total monthly cost of a single, critical project, 'Project Unicorn,' for financial reporting. Resources for this project are always tagged with `Project: Unicorn`. The project utilizes a wide variety of AWS services, but the finance team is only concerned with the budget for compute and storage costs. Specifically, the budget must only track costs generated by Amazon EC2 (including instance usage, data transfer, and EBS volumes), Amazon RDS, and Amazon S3. These project resources are spread across multiple member accounts in the company's AWS Organization. The finance team requires a single, consolidated budget in the management account to monitor this very specific slice of costs.",
      "questionText": "To create a budget that accurately tracks only the specified service costs for 'Project Unicorn' across all relevant accounts, which two filters must be configured in the AWS Budget setup?",
      "isMultiChoice": true,
      "options": [
        {
          "letter": "A",
          "text": "A 'Linked Account' filter, where the finance team must manually select all member accounts known to be associated with the project."
        },
        {
          "letter": "B",
          "text": "A 'Cost Category' filter, after creating a cost category named 'Project Unicorn' that uses the appropriate tag as a rule."
        },
        {
          "letter": "C",
          "text": "A 'Service' filter, where the team selects 'Amazon Elastic Compute Cloud - Compute', 'Amazon Relational Database Service', and 'Amazon Simple Storage Service'."
        },
        {
          "letter": "D",
          "text": "A 'Tag' filter, with the tag key set to 'Project' and the tag value set to 'Unicorn'."
        },
        {
          "letter": "E",
          "text": "A 'Usage Type' filter, where the team must select all specific usage types like `USE2-BoxUsage:c5.large`, `USE2-EBS:VolumeUsage.gp2`, etc."
        }
      ],
      "correctAnswers": [
        "C",
        "D"
      ],
      "explanation": "Why C and D are correct: \nC: The 'Service' filter is essential to meet the explicit requirement of only tracking costs for the specified services (EC2, RDS, and S3). Without this filter, the budget would incorrectly include costs from any other services (like DynamoDB, Lambda, etc.) that happen to have the 'Project: Unicorn' tag, violating the requirements. \nD: The 'Tag' filter is the primary and most scalable mechanism to isolate costs for a specific project that spans multiple services and accounts. By filtering for the tag key 'Project' and value 'Unicorn', the budget will automatically aggregate costs from any resource that has been appropriately tagged, regardless of which member account it resides in. These two filters work together to create the precise intersection of costs required.",
      "wrongExplanation": "Why the others are wrong: \nA: While you can filter by linked account, it's not the best practice here. It's not scalable, as a new account could join the project and would have to be manually added. The tag-based filtering automatically handles this, making the budget more robust and easier to manage. \nB: Cost Categories are another way to group costs, but they are a higher-level construct often used for creating broad buckets for cost allocation reports. For a specific budget, filtering directly on the tag is more direct and less complex than creating a Cost Category first and then filtering on that. \nE: A 'Usage Type' filter is far too granular and completely impractical for this scenario. It would require the team to identify and maintain a list of hundreds of specific line items, which is unmanageable and would likely miss costs as new instance types or features are used."
    },
    {
      "number": 9,
      "title": "Compute Optimizer with Enhanced Memory Metrics",
      "scenario": "A company is using AWS Compute Optimizer to right-size their EC2 fleet and reduce costs. For a critical, memory-intensive application running on an `r5.2xlarge` instance, Compute Optimizer is consistently recommending a downsize to an `r5.xlarge`. The recommendation's 'Reason' is 'CPU Over-provisioned,' and it shows a significant potential cost saving. However, the operations team is hesitant because they know the application frequently uses more than the 32GiB of RAM available in an `r5.xlarge`, but this memory usage consists of short, intense spikes that are not well-represented by the default 5-minute average CloudWatch metrics that Compute Optimizer uses for its analysis.",
      "questionText": "What is the most appropriate and data-driven action the team should take to ensure Compute Optimizer provides a more accurate and trustworthy recommendation for this specific instance before they make any changes?",
      "isMultiChoice": false,
      "options": [
        {
          "letter": "A",
          "text": "Accept the risk, manually change the instance type to the recommended `r5.xlarge`, and closely monitor the application's performance for any degradation or errors."
        },
        {
          "letter": "B",
          "text": "Dismiss the recommendation in the Compute Optimizer console and create a calendar reminder to re-evaluate the instance's performance in another 30 days."
        },
        {
          "letter": "C",
          "text": "Install and configure the AWS CloudWatch agent on the instance to collect and report detailed memory utilization metrics (e.g., `mem_used_percent`) to CloudWatch, and then wait for Compute Optimizer to re-analyze the instance with this new data."
        },
        {
          "letter": "D",
          "text": "Enable AWS Cost Anomaly Detection with a monitor scoped to this specific instance ID to see if its cost deviates from the expected pattern, which would indicate a problem."
        }
      ],
      "correctAnswers": [
        "C"
      ],
      "explanation": "Why C is correct: AWS Compute Optimizer's recommendations are only as good as the data it analyzes. By default, due to the agentless nature of the EC2 hypervisor, AWS does not have access to an EC2 instance's guest OS memory utilization. To provide this crucial data, you must install the CloudWatch agent on the instance and configure it to collect and push memory metrics to CloudWatch. Compute Optimizer is designed to detect when these enhanced metrics are available. After a new analysis period (typically 14-30 hours), it will incorporate the memory utilization data into its machine learning model, providing a much more accurate rightsizing recommendation that balances CPU, network, disk, *and* memory pressure, likely changing the recommendation to a more appropriate instance type.",
      "wrongExplanation": "Why the others are wrong: \nA: This is a risky, 'guess-and-check' approach that could lead to a production outage or severe performance degradation if the downsized instance is indeed too small for the memory spikes. The goal is to make a better data-driven decision first. \nB: Dismissing the recommendation does not solve the underlying data gap. The recommendation is based on the data available, and without new memory metrics, Compute Optimizer will likely make the same CPU-based recommendation again after the snooze period expires. \nD: AWS Cost Anomaly Detection is a financial governance tool. It is excellent at reporting when costs are unexpected, but it provides no insight into the technical performance or resource utilization of the instance. It cannot help improve the technical accuracy of the rightsizing recommendation."
    },
    {
      "number": 10,
      "title": "Centralized Analysis of Compute Optimizer Findings",
      "scenario": "A central FinOps team is responsible for driving cost-optimization initiatives across a large AWS Organization with hundreds of member accounts. Their current goal is to programmatically identify all EC2 instances and Auto Scaling groups that are flagged as 'Over-provisioned' by AWS Compute Optimizer. To prioritize their efforts, they need to focus only on findings where the potential monthly savings are greater than $50. They must get this data from all accounts into a single, queryable location for ongoing reporting and tracking.",
      "questionText": "What is the most efficient and scalable method to continuously export and query these specific, high-value Compute Optimizer findings from across the entire organization?",
      "isMultiChoice": false,
      "options": [
        {
          "letter": "A",
          "text": "Write a central Lambda function that assumes a role in each member account, uses the `GetEC2InstanceRecommendations` and `GetAutoScalingGroupRecommendations` API calls, paginates through all results, filters them in memory, and writes the output to a DynamoDB table."
        },
        {
          "letter": "B",
          "text": "Instruct each member account owner to go into the Compute Optimizer console, manually apply a filter for 'Over-provisioned', and export the current view to a CSV file that they then upload to a central S3 bucket."
        },
        {
          "letter": "C",
          "text": "From the organization's management or delegated administrator account, configure the 'Recommendation exports' feature in Compute Optimizer to save all findings for the entire organization to a central S3 bucket. Then, use Amazon Athena to query the exported data with SQL."
        },
        {
          "letter": "D",
          "text": "Enable AWS Config in all accounts and configure it to track Compute Optimizer recommendations as a type of configuration item. Then, use Config's advanced query feature from an aggregator in the management account to find the desired instances."
        }
      ],
      "correctAnswers": [
        "C"
      ],
      "explanation": "Why C is correct: Compute Optimizer has a built-in feature called 'Recommendation exports' that is designed for this exact purpose. From a management or delegated administrator account, you can create an export job that automatically gathers findings from all member accounts in the organization and delivers them to a single, specified S3 bucket. This is the most scalable and manageable way to get a complete data set. Once the data (in CSV or JSON format) is in S3, it can be easily cataloged by an AWS Glue crawler and queried using the powerful, serverless SQL engine of Amazon Athena. This allows the FinOps team to run complex queries to filter the findings on any attribute, such as `finding = 'Over-provisioned'` and `savingsOpportunity.estimatedMonthlySavings.value > 50`, providing a robust and flexible reporting solution.",
      "wrongExplanation": "Why the others are wrong: \nA: This approach is highly inefficient, brittle, and complex to maintain. It requires writing and managing custom code to handle cross-account permissions, API pagination, and error handling, which does not scale well for a large organization. The native export feature makes this custom solution obsolete. \nB: A manual export process is not programmatic, scalable, or reliable. It depends on the manual effort of many individuals, is prone to human error, and is unsuitable for the kind of ongoing, automated reporting required by a central FinOps team. \nD: This describes a non-existent integration. AWS Config tracks the configuration state and changes of AWS resources; it does not natively ingest or track recommendations from other services like Compute Optimizer as configuration items."
    }
  ]

