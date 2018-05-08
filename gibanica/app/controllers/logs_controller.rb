class LogsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :disable_json, only: [:index]
  before_action :allow_json_only, only: [:create]
  before_action :set_log, only: [:show]

  # GET /logs
  def index
    @logs = if params[:filterBy].nil?
              { logs: Log.all }
            else
              { logs: Log.search(params[:filterBy], params[:searchBy]) }
            end
  end

  # GET /logs/1
  def show
    @log = { log: @log }
  end

  # POST /logs
  def create
    Log.batch_save!(log_params)

    head :ok
  end

  private

    def disable_json
      head :not_found if request.headers['Content-Type'] == 'application/json'
    end

    def allow_json_only
      head :not_found unless request.headers['Content-Type'] == 'application/json'
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_log
      @log = Log.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def log_params
      # check for agents sending logs. based on agent, allow different params
      case params[:agent]
      when 'vladk'
        params.permit(logs: [:logged_time, :host, :process, :severity,
                              {
                                message: %i[port isOpen]
                              }
                            ]).require(:logs)
      when 'miko'
        params.permit(logs: [:logged_time, :host, :process, :severity,
                              {
                                message: %i[name user time is_dir dir_path action]
                              }
                            ]).require(:logs)
      when 'dragan'
        params.permit(logs: [:host, :logged_time, :process, :severity,
                              {
                                message: %i[username method]
                              }
                            ]).require(:logs)
      when 'stanija'
        params.permit(logs: [:host, :logged_time, :process, :severity,
                              {
                                message: %i[frequency temperature memory swap]
                              }
                            ]).require(:logs)
      when 'pacman'
        params.permit(logs: [:host, :logged_time, :process, :severity,
                              {
                                message: %i[content]
                              }
                            ]).require(:logs)
      else
        puts 'Agent not recognized'
      end
    end
end
